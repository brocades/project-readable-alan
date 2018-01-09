import React, { Component } from 'react';
import '../App.css';
import Comment from './Comment'
import * as ReadableAPI from '../ReadableAPI'

class App extends Component {

  state = {
    categories: [],
    post: {
      id: '8xf0y6ziyjabvozdd253nd',
      timestamp: 1467166872634,
      title: 'Udacity is the best place to learn React',
      body: 'Everyone says so after all.',
      author: 'thingtwo',
      category: 'react',
      voteScore: 6,
      deleted: false,
      commentCount: 2
    },
    category: {
      name: 'react',
      path: 'react'
    }
  }

  getPost = (post) => {
    ReadableAPI.getPost(post).then((post) => {
      console.log(post)
    })
  }

  getCategoryPosts = (category) => {
    ReadableAPI.getCategoryPosts(category).then((posts) => {
      console.log(posts)
    })
  }
  getAllPosts = () => {
    ReadableAPI.getAllPosts().then((posts) => {
      console.log(posts)
    })
  }
  getPostComments = (post) => {
    ReadableAPI.getPostComments(post).then((comments) => {
      console.log(comments)
    })
  }
  getCategories = () => {
    ReadableAPI.getCategories().then((categories) => {
      this.setState({ categories })
      console.log(categories)
    })
  }
  componentDidMount() {
    //this.getCategoryPosts(this.state.category)
    this.getCategories()
    //this.getPost(this.state.post)
    //this.getAllPosts()
    //this.getPostComments(this.state.post)
  }

  render() {
    return (
      <div className="App">
      <header>
        <h1 className="app-title">Posts App</h1>
      </header>

      <section className="categories-section">
        <h2 className="category-title">Categories</h2>
        <ul>
          <h2>All</h2>
          {this.state.categories.map((category) => (
              <h2> {category.name} </h2>
            ))}
        </ul>
      </section>

      <section className="posts-section">
        <section className="posts-header">
          <h2 className="posts-title">Posts</h2>
          <h2 className="order-by">Order by </h2>
        </section>
        <hr/>
        <section className="posts-content">
          <Comment/>
        </section>
      </section>

      <footer></footer>
      </div>
    )
  }
}

export default App;
