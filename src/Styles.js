import { StyleSheet } from 'react-native'

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightgray',
  },
  textInput: {
    height: 40,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    color: 'black',
    width: '90%',
    borderWidth:1,
    borderColor:'#bbbbbb',
    borderRadius:3,
    backgroundColor: '#efefef',
  },
  remoteTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'gray',
  },
  buttonsArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    padding: 15,
    backgroundColor: '#00000099',
    borderRadius:20
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  },
  roundButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 42,
    marginHorizontal:10
  },
  leaveButton: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: 'red'
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
  },
  localTrack: {
    backgroundColor: 'white',
    bottom: 95,
    right: 20,
    zIndex: 99,
    width: 100,
    height: 150,
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 3,
  },

  conferenceContainer: {
    borderWidth:0,
    position: 'absolute',
    width:'100%'
  },
  joinContainer:{
    width:'70%',
    height:'40%',
    backgroundColor: 'white',
    borderRadius:5
  },
  conferenceInfo:{
    marginTop:40,
    padding:10,
    borderRadius:5,
    backgroundColor: '#00000099',
  },
  white: {
    color: 'white'
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Styles
