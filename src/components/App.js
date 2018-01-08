import React, { Component } from 'react';
import '../App.css';
import Comment from './Comment'
import * as ReadableAPI from '../ReadableAPI'

class App extends Component {

  state = {
    categories: []
  }


  getCategories = () => {
    ReadableAPI.getCategories().then((categories) => {
      this.setState({ categories })
      console.log(categories)
    })
  }
  componentDidMount() {
    this.getCategories()
  }

  render() {
    return (
      <div className="App">
        <ul>
          {this.state.categories.map((category) => (
              <li> {category.name} </li>
            ))}
        </ul>
        <Comment/>
      </div>
    )
  }
}

export default App;
