import * as React from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet ,Alert} from 'react-native';
import db from '../config';

export default class MyHeader extends React.Component{
 constructor(props){
   super(props);

   this.state = {
     value: ""
   }
 }

 noOfUnreadNot=()=>{
   db.collection("all_Notifications").where("notififcationStatus", "==", "unread")
   .onSnapshot((snapshot)=>{
     var unreadNots = snapshot.docs.map((doc)=>{
       doc.data()
     })
     this.setState({
       value: unreadNots
     })
   })
 }

 bellIconBadge=()=>{
   return(
    <View>
    <Icon
     name="bell"
     type="font-awesome"
     color="#03588C"
     onPress={
       ()=>{
         this.props.navigation.navigate("Notification")
       }
     }
    />
    <Badge
     value={this.state.value}
     containerStyle={{position: "absolute", top: -4, right: -4}}
    />
    </View>
   )
 }

 componentDidMount(){
   this.noOfUnreadNot()
   console.log(this.state.value)
 }

 render(){
   return(
    <Header
    leftComponent ={
      <Icon
       name="bars"
       type="font-awesome"
       color="#03588C"
       onPress={
         ()=>{
          this.props.navigation.toggleDrawer()
         }
       }
      />
    }
    rightComponent={
    <this.bellIconBadge
     {...this.props}
    />
    }
    centerComponent={{ text: this.props.title, style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
    backgroundColor = "#eaf8fe"
  />
   )
 }
}