import "../styles/AddComment.scss";

function AddComment({user, replyingName, sendMessage, comment, reply, sendNewMessage}) {   

    const postText = e => comment !==null ? sendMessage(e, comment, reply) : sendNewMessage(e);

    return (
        <div className="add-comment">
            
            <img src={user.image.png} alt="user" />
            <p data-placeholder="Add a comment..." contentEditable>
                {replyingName && comment !==null && <span>{`@${replyingName}`}</span>}
                <i>&nbsp;</i>
            </p>
            <button onClick={e => {
                if(e.target.previousSibling.querySelector("i").innerHTML !== "&nbsp;" ){
                    postText(e.target.previousSibling.querySelector("i").innerText);
                    e.target.previousSibling.querySelector("i").innerHTML = "&nbsp;" 
                }            
                }}>SEND</button>
        </div>        
    )
}

export default AddComment
