import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket:SocketIOClient.Socket;                           //Socket instance
  //url:string='ws://localhost:3000';                       //node server port
  url:string='ws://backend_service:3000';                 //node server port

  private test_data = new BehaviorSubject<number[]>([]);  //BehaviorSubject instance typecasted to number array.
  cast=this.test_data.asObservable();                     //'cast' can be subscribed in any component to observe
                                                          //the changes on 'test_data'

  constructor() {
    this.socket=io(this.url);
    this.socket.on('test_event',(data)=>{
      if(this.test_data.getValue().length==10)             //condition to maintain the array length as 10.
      {
        this.test_data.getValue().shift();
      };
      this.test_data.next(this.test_data.getValue().concat(data));    //next() is a Function in BehaviorSubject class, 
                                                                      //used to track changes to the Observable 'cast'
    })
  }

}