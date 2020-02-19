import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostForm from '../Components/PostForm';
import PostCard from '../Components/PostCard';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data: getPosts } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Post</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Posts...</h1>
        ) : (
          <Transition.Group>
            {getPosts.getPosts &&
              getPosts.getPosts.map(post => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
