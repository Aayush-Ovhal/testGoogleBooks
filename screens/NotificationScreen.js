import * as React from 'react';
import { StyleSheet, View, FlatList,Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import SwipeableFlatlist from '../components/SwipeableFlatlist';
import db from '../config';

var allNotifications =  []

export default class NotificationScreen extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      userId :  firebase.auth().currentUser.email,
      everyNotification : []
    };

    this.notificationRef = null
  }

  getNotifications=()=>{
    this.notificationRef = db.collection("all_Notifications")
    .where("notificationStatus", "==", "unread")
    .where("targeted_Rid",'==',this.state.userId)
    .onSnapshot((snapshot)=>{
      snapshot.docs.map((doc) =>{
        var notification = doc.data()
        console.log(notification)
        notification["requestId"] = doc.id
        allNotifications.push(notification)
      });
      console.log(allNotifications)
    })
    console.log("No errror")
  }

  componentDidMount(){
    this.getNotifications()
  }

  componentWillUnmount(){
    this.notificationRef()
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({item,index}) =>{
      return (
        <ListItem
          key={index}
          leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
          title={item.book_name}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          subtitle={item.message}
          bottomDivider
        />
      )
 }


  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
        </View>
        <View style={{flex:0.9}}>
          {
            allNotifications.length === 0
            ?(
              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:25}}>You have no notifications</Text>
              </View>
            )
            :(
              <FlatList  
              keyExtractor={this.keyExtractor}
              data={allNotifications}
              renderItem={this.renderItem}/>
            )
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container : {
    flex : 1
  }
})