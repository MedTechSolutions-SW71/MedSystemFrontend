import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {ChatMessage} from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;

  constructor() {
    this.initConnectionSocket()
  }

  initConnectionSocket(){
    const url ='//localhost:8005/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);

  }

  joinRoom(roomId: string){
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/${roomId}`,(messages: any) => {
        const messageContent = JSON.parse(messages.body);
        console.log(messageContent);
      })
    })
  }

  sendMessage(roomId: string, chatMessage: ChatMessage){
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
  }

}
