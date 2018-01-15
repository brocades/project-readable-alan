import React, { Component } from 'react'
import { If, Then, Else } from 'react-if'
import PropTypes from 'prop-types'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose, FaBan } from 'react-icons/lib/fa'
import '../post.css'
import Comment from './Comment'
import * as ReadableAPI from '../ReadableAPI'
import serializeForm from 'form-serialize'
const uuidv1 = require('uuid/v1');

class Post extends Component {

	state = {
		comments: [],
		editting: false,
	}

	handleSubmit = (e) => {
		e.preventDefault()
		const defaultValues = {
			id: uuidv1(),
			timestamp: Date.now(),
		}
		const inputValues = serializeForm(e.target, { hash: true })
		const post = {
			...defaultValues,
			...inputValues
		}
		ReadableAPI.uploadPost(post)
			.catch((reason) => {
				console.log(`>>> Post not uploaded due to: ${reason}`)
			})
	}
	isEditting() {
		return this.state.editting
	}

	toggleEditting() {
		this.setState({ editting: !this.state.editting })
	}

	sendComment() {
		//TODO dispatch comment upload action
	}

	editComment() {
		//TODO dispatch comment update action
	}

	deleteComment() {
		//TODO dispatch comment delete action
	}

	getValidCategories() {
		const categories = this.props.categories
		const categoriesList = [ ...categories]
		return categoriesList.slice(1)
	}

	getComments() {
		ReadableAPI.getPostComments(this.props.post.id).then((comments) => {
			this.setState({ comments })
		})
	}

	getPostProps() {
		let props = {
			id: null,
			voteScore: null,
			title: null,
			author: null,
			body: null,
		}
		if (this.props.post)
			props = this.props.post
		return props
	}
	componentDidMount() {
		if (this.props.type === "display")
			this.getComments()
	}

	render() {
		const { id, voteScore, title, author, body } = this.getPostProps()
		const categories = this.getValidCategories()
		const type = this.props.type
		const { comments } = this.state
		return (
			<If condition={type !== "submit"}>
				<Then>
					<section id={id} className="post">
						<If condition={this.isEditting() === false}>
							<Then>
								<section className="post-wrapper">
									<section className="vote-score-section">
										<FaAngleUp/>
											<p>{voteScore}</p>
										<FaAngleDown/>
									</section>
									<section className="post-section">
										<section className="post-title">
											<h3>{title} by {author}
											</h3>
											<div className="edit-button" onClick={() => this.toggleEditting()}>
												<FaEdit/>
											</div>
											<div className="delete-button">
												<FaClose/>
											</div>
										</section>
										<section className="post-body">
											<p>{body}</p>

										</section>
										<If condition={comments instanceof Array}>
											<Then>
												<section className="comments-wrapper">
													{comments.map((comment) => (
															<Comment key={comment.id} comment={comment}/>
														))}
												</section>
											</Then>
											<Else>
												<p>Be the first to comment!</p>
											</Else>
										</If>
									</section>
								</section>
							</Then>
							<Else>
								<form >
									<section className="post-wrapper">
										<section className="vote-score-section">
											<FaAngleUp/>
												<p>{voteScore}</p>
											<FaAngleDown/>
										</section>
										<section className="post-section">
											<section className="post-header">
												<input className="post-title-input" type="text" defaultValue={title} placeholder="React is awesome!"/>
												<h3>by</h3>
												<input className="post-author-input" type="text" defaultValue={author} placeholder="ex.: Alan Brochier"/>
												<div className="cancel-button" onClick={() => this.toggleEditting()}>
													<FaBan/>
												</div>
											</section>
											<section className="post-body">
												<textarea className="post-body-input" defaultValue={body} placeholder="Write your commentary here...">
												</textarea>
												<input type="submit" value="Send"/>
											</section>
											<If condition={comments instanceof Array}>
												<Then>
													<section className="comments-wrapper">
														{comments.map((comment) => (
																<Comment key={comment.id} comment={comment}/>
															))}
													</section>
												</Then>
												<Else>
													<p>Be the first to comment!</p>
												</Else>
											</If>
										</section>
									</section>
								</form>
							</Else>
						</If>
					</section>
				</Then>
				<Else>
					<form onSubmit={this.handleSubmit}>
						<section className="post-wrapper">
							<section className="post-section">
								<section className="post-header">
									<input className="post-title-input" type="text" name="title" defaultValue={title} placeholder="React is awesome!"/>
									<h3>by</h3>
									<input className="post-author-input" type="text" name="author" defaultValue={author} placeholder="ex.: Alan Brochier"/>
									<select name="category">
										{categories.map((category, index) => (
												<option key={index} value={category.name}>{category.name}</option>
											))}
									</select>
								</section>
								<section className="post-body">
									<textarea className="post-body-input" name="body" defaultValue={body} placeholder="Write your commentary here...">
									</textarea>
									<input type="submit" value="Send"/>
								</section>
							</section>
						</section>
					</form>
				</Else>
			</If>
		)
	}
}

Post.propTypes = {
	id: PropTypes.string,
	voteScore: PropTypes.number,
	title: PropTypes.string,
	author: PropTypes.string,
	body: PropTypes.string,
}

export default Post