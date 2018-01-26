import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendPost } from '../actions'
import '../post.css'
import * as ReadableAPI from '../ReadableAPI'
import serializeForm from 'form-serialize'
import PropTypes from 'prop-types'
const uuidv1 = require('uuid/v1');

class PostSubmit extends Component {

	handlePostUpload = (e) => {
		e.preventDefault()
		const defaultValues = {
			id: uuidv1(),
			timestamp: Date.now(),
			commentCount: 0,
			voteScore: 1,
			deleted: false,
		}
		const inputValues = serializeForm(e.target, { hash: true })
		const post = {
			...defaultValues,
			...inputValues
		}
		//TODO dispatch post list update action
		this.props.uploadPost(post)
		ReadableAPI.uploadPost(post)
			.catch((reason) => {
				console.log(`>>> Post not uploaded due to: ${reason}`)
			})
		this.resetInputform()
	}

	resetInputform = () => {
		const postUploadForm = document.getElementById("postUploadForm")
		postUploadForm.reset()
	}

	getValidCategories() {
		const categories = this.props.categories
		const categoriesList = [ ...categories]
		return categoriesList.slice(1)
	}

	render() {
		const categories = this.getValidCategories()
		return (
			<form id="postUploadForm" onSubmit={this.handlePostUpload}>
				<section className="post-wrapper">
					<section className="post-section">
						<section className="post-header">
							<input
								className="post-title-input"
								type="text"
								name="title"
								placeholder="React is awesome!"/>
							<h3>by</h3>
							<input
								className="post-author-input"
								type="text"
								name="author"
								placeholder="ex.: Alan Brochier"/>
							<select name="category">
								{categories.map((category) => (
										<option
											key={category.path}
											value={category.name}>{category.name}</option>
									))}
							</select>
						</section>
						<section className="post-body">
							<textarea
								className="post-body-input"
								name="body"
								placeholder="Write your commentary here...">
							</textarea>
							<input className="post-input-button" type="submit" value="Send"/>
						</section>
					</section>
				</section>
			</form>
		)
	}
}

PostSubmit.propTypes = {
	title: PropTypes.string,
	author: PropTypes.string,
	body: PropTypes.string,
}

const mapStateToProps = ({ post }) => ({
	categories: post.categories
})

const mapDispatchToProps = (dispatch) => ({
	uploadPost: (data) => dispatch(sendPost(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostSubmit)