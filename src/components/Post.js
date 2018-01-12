import React, { Component } from 'react'
import { If, Then, Else } from 'react-if'
import PropTypes from 'prop-types'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose, FaBan } from 'react-icons/lib/fa'
import '../post.css'
import Comment from './Comment'
import * as ReadableAPI from '../ReadableAPI'

class Post extends Component {

	state = {
		comments: [],
		editting: false,
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

	getComments() {
		ReadableAPI.getPostComments(this.props.post.id).then((comments) => {
			this.setState({ comments })
		})
	}

	componentDidMount() {
		this.getComments()
	}

	render() {
		const { id, voteScore, title, author, body } = this.props.post
		const { comments } = this.state
		return (
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
										<input className="post-title-input" type="text" defaultValue={title} placeholder="ex.: Alan Brochier"/>
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