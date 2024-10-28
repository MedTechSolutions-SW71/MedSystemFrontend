import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {ChatMessage} from '../models/chat-message';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;

  // creo un listener para escuchar desde el frontend
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

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
        // capturamos el mensaje y lo agregamos al array de mensajes
        const currentMessages = this.messageSubject.getValue();
        this.messageSubject.next([...currentMessages, messageContent]);


      })
    })
  }

  sendMessage(roomId: string, chatMessage: ChatMessage){
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
  }

  // metodo que retorna el subject para que el componente pueda subscribirse
  getMessageSubject(){
    return this.messageSubject.asObservable();
  }

}
