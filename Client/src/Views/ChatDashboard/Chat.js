import { useContext, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { NavbarContext } from '../../App';
import Button from '../../Components/Button/Button';
import Conversation from '../../Components/Conversations/Conversation';
import Message from '../../Components/Message/Message';
import style from './chat.module.css';
import { io } from 'socket.io-client';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const { setNavVal } = useContext(NavbarContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const socket = useRef();
  document.title = 'Chat Dashboard';

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
    setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    socket.current = io(`ws://localhost:8900`);
    socket.current.on("getMessage", data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      })
    })
  }, [])

  useEffect(() => {
    let isMounted = true;
    let user = '';

    try {
      user = JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      localStorage.removeItem('token');
      return isMounted ? setToken(null) : null;
    }
    
    if (isMounted) {
      setNavVal(null);
      setUser(user);
    }

    fetch(`http://192.168.0.75:5000/api/conversations/${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status !== 200) {
        localStorage.removeItem('token');
        return isMounted ? setToken(null) : null;
      }

      return isMounted ? setConversations(res.conversation) : null;
    })
    .catch(err => {
      console.log(err);
    })
    
    return () => isMounted = false;
  }, [setNavVal, token])

  useEffect(() => {
    user && socket.current.emit("addUser", user.id);
    socket.current.on("getUsers", users => {
      console.log(users)
    });
  }, [user])

  useEffect(() => {
    let isMounted = true;
    fetch(`http://192.168.0.75:5000/api/messages/${currentChat?._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status !== 200) {
        localStorage.removeItem('token');
        return isMounted ? setToken(null) : null;
      }

      return isMounted ? setMessages(res.messages) : null;
    })
    .catch(err => {
      console.log(err);
    })

    return () => isMounted = false;
  }, [currentChat, token])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = {
      sender: user.id,
      text: newMessage,
      conversationId: currentChat._id
    };

    const receiverId = currentChat.members.find(member => member !== user.id)

    socket.current.emit("sendMessage", {
      senderId: user.id,
      receiverId,
      text: newMessage
    })

    fetch(`http://192.168.0.75:5000/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        message: message
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 200) {
        setMessages([...messages, res.savedMessage]);
        setNewMessage('');
        return
      }

      console.log(res)
    })
    .catch(err => {
      console.log(err);
    })
  }

  return token ? (
    <div className={style.messenger}>
      <div className={style.userList}>
        <div className={style.chatWrapper}>
          
          {conversations.map((c, index) => (
            <div key={index} onClick={() => setCurrentChat(c)}>
              <Conversation
                key={index}
                conversation={c}
                currentUser={user}
                setActive={setCurrentChat}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={style.chatBox}>
        <div className={style.chatBoxWrapper}>
          {currentChat ? ( 
            <>
              <div className={style.chatBoxTop}>
                {messages.map(m => (
                  <div ref={scrollRef}>
                    <Message 
                      message={m}
                      own={m.sender === user.id}
                    />
                  </div>
                ))}
              </div>

              <div className={style.chatBoxBottom}>
                <textarea
                  className={style.chatMessageInput}
                  placeholder="Type something ..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                ></textarea>

                <Button 
                  className={style.chatSubmitButton}
                  onClick={handleSubmit}
                  label={"Send"}
                  type={"submit"}
                />
              </div>
            </>
          ) : (
            <span className={style.noConversationText}>
              Open a conversation to start a chat.
            </span>
          )}
        </div>
      </div>
      <div className={style.chatOnline}>
        <div className={style.chatOnlineWrapper}>
        </div>
      </div>
    </div>
  ) : <Navigate to="/login" /> ;
}
 
export default Chat;