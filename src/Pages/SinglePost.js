import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  Grid,
  Card,
  Image,
  Button,
  Icon,
  Label,
  Form
} from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../Components/LikeButton';
import DeleteButton from '../Components/DeleteButton';
function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
    },
    variables: { postId, body: comment }
  });

  function deletePostCallback() {
    props.history.push('/');
  }

  let postMarkup;
  if (loading) {
    postMarkup = <p>Loading post...</p>;
  } else if (error) {
    postMarkup = <p>Error in fetching post</p>;
  } else {
    const {
      getPost: {
        id,
        username,
        body,
        createdAt,
        likes,
        likeCount,
        comments,
        commentCount
      }
    } = data;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated='right'
              size='mini'
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Button
                  as='div'
                  labelPosition='right'
                  onClick={() => console.log('Comment on post')}
                >
                  <Button color='blue' basic>
                    <Icon name='comments' />
                  </Button>
                  <Label color='blue' pointing='left' basic>
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='Comment...'
                        name='comment'
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                      />
                      <button
                        type='submit'
                        className='ui button teal'
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      username
      body
      createdAt
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

export default SinglePost;
