import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books';
import {SearchBar,ListItem} from 'react-native-elements'

export default class BookRequestScreen extends React.Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      IsBookRequestActive : "",
      requestedBookName: "",
      bookStatus:"",
      requestId:"",
      userDocId: '',
      docId :'',
      Imagelink: '',
      dataSource:"",
      showFlatlist: false
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addRequest =async(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId();
    var books = await BookSearch.searchBook(bookName, 'AIzaSyDEpbcDl9Yc5tDNAYTr6i6x32QRqmuT-Jw');
    db.collection('requested_books').add({
        "user_id": userId,    
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "bookStatus": "requested",
        "data": firebase.firestore.FieldValue.serverTimestamp(),
        "ImageLink": books.data[0].volumeInfo.imageLinks.smallThumbnail
    })

    await this.getBookRequest()
    db.collection('users').where("emailId", "==", userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
          IsBookRequestActive: true
        })
      })
    })

    this.setState({
        bookName :'',
        reasonToRequest : '',
        requestId: randomRequestId
    })

    return Alert.alert("Book Requested Successfully")
  }

  receivedBooks=(bookName)=>{
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_books").add({
      "book_name": bookName,
      "user_id": userId,
      "request_id": requestId,
      "bookStatus": "received"
    })
  }

  getIsBookRequestActive(){
    db.collection("users")
    .where("emailId", "==", this.state.userId)
    .onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          IsBookRequestActive: doc.data().IsBookRequestActive,
          userDocId: doc.id
        })
      })
    })
  }

  getBookRequest=()=>{
   var bookRequest = db.collection("requested_books")
   .where("emailId", "==", this.state.userId)
   .get()
   .then((snapshot)=>{
     snapshot.forEach((doc)=>{
       if(doc.data().book_status !== "received"){
         this.setState({
           requestId: doc.data().request_id,
           requestedBookName: doc.data().book_name,
           bookStatus: doc.data().bookStatus,
           docId: doc.id
         })
       }
     })
   })
  }

  sendNotification=()=>{
    db.collection("users").where("userId", "==", this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var firstName = doc.data().first_name;
        var lastName = doc.data().last_name;

        db.collection("all_Notifications").where("requestId", "==", this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var donorId = doc.data().donor_id;
            var bookName =  doc.data().book_name;

           db.collection("all_Notifications").add({
             "targeted_user_id": donorName,
             "message": firstName + " " + lastName  + " has received the book " + bookName,
             "notification_status": "unread",
             "book_name": bookName
           })
          })
        })
      })
    })
  }

  render(){
    return(
        <View style={{flex:1}}>
          <MyHeader navigation={this.props.navigation} title="Request Book"/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
