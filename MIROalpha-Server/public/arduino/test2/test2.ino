//Arduino test2

void setup(){
    pinMode(3,OUTPUT);
    pinMode(2,OUTPUT);
}

void loop(){
    
    digitalWrite(2,HIGH);
    delay(1000);
    digitalWrite(2,LOW);
    delay(1000);
   
    for(int i = 0; i <100; i++){
          boolean flag = false;
          if(flag == false){
                  digitalWrite(2,HIGH);
                  delay(200);
                  flag= ture;
          }
          else{
                  digitalWrite(2,LOW);
                  delay(200);
                  flag=false;
           }
   }
                 

}