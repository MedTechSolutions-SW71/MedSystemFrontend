import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {ChatMessage} from '../../models/chat-message';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{

  // variables para capturar mensajes
  messageInput: string = "";
  userId: string = "";
  messageList : any[] = []; // captura toda la conversacion

  constructor(private chatService: ChatService, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params["userId"];
    this.chatService.joinRoom("ABC");
    this.listenerMessages();
  }

  sendMessage(){
    const chatMessage = {
      message: this.messageInput,
      user: this.userId,
    } as ChatMessage
    this.chatService.sendMessage("ABC",chatMessage);
    this.messageInput = '';
  }

  // metodo para subscribirse al observable
  listenerMessages(){
    this.chatService.getMessageSubject().subscribe((messages: ChatMessage[]) => {
      this.messageList = messages.map((item : any) => ({
        ...item,
          message_side: item.user === this.userId ? 'sender' : 'receiver'
      }));
    });
  }
}
