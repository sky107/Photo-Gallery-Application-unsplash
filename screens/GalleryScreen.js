import React from 'react';
import {Animated,Button,Image,Keyboard,Modal,FlatList,Text,View,StyleSheet,TextInput,TouchableOpacity,ActivityIndicator} from 'react-native';



function search(){



}



const App=()=>{
		const [isLoading,setIsLoading]=React.useState(false);

		
	const DATA=[1,2,3,4,5,6,7,8,9,10];



	
	return(<>
		<View style={styles.header}>
		<Text style={styles.appName}>Photo Gallery Application</Text>
		</View>
		<View style={styles.main}>
		<View style={styles.menu}>
			<TextInput style={styles.input} autoCapitalize="none"/>
			<TouchableOpacity onPress={()=>{setIsLoading(!isLoading);Keyboard.dismiss()}}><Text style={styles.searchButton}>Search</Text></TouchableOpacity>
		</View>
		<View style={styles.resultScreen}>

	{	isLoading && <View  style={styles.loader}>
			 <ActivityIndicator size="large" color="dodgerblue" />
			 <Text style={{marginLeft:'39%',marginTop:10}}>Please wait...</Text>
			 	</View>}



		{	!isLoading && <Animated.FlatList
					showsVerticalScrollIndicator={false}
					data={DATA}
					keyExtractor={(i)=>i}
					renderItem={({item,index})=>{
		
						return (<View style={styles.card}>
							 <Modal
		        animationType="slide"
		        visible={false}
		        onRequestClose={() => {
		        }}
		      >
		      </Modal>
		       <Image
		        source={{ uri: 'https://res.cloudinary.com/df2q7cryi/image/upload/v1624070127/IMG-20210619-WA0000_ygk7bg.jpg' }}
		        style={StyleSheet.absoluteFillObject}
		       
		      />
		      				<TouchableOpacity>
							<Text style={styles.downloadButton}>Download</Text>
		      				</TouchableOpacity>
								
								
							</View>)
					}}
					/>
		
		}


			
		 </View>
		{ !isLoading && <View style={styles.footer}>
				 <Text>1 2 3 4 5</Text>
				 </View>}
		</View>
		</>);


}


const styles=StyleSheet.create({
header:{
	backgroundColor:'dodgerblue',
	padding:20
},
appName:{
	color:'white'
},
main:{
	backgroundColor:'white',
	flex:1
},
menu:{
flexDirection: 'row'
},
input:{
	borderWidth:1,
	borderColor: '#eee',
	color:'grey',
	margin:20,
	padding:5,
	paddingLeft:10,
	paddingRight:10,
	flexGrow:1,
	backgroundColor:'#eee'
	
},
searchButton:{
	backgroundColor:'dodgerblue',
	padding:10,
	margin:20,
	marginLeft:0,
	color:'white'
},
loader:{
	flex:0.9,
	justifyContent:'center'
},
resultScreen:{flex:1,
	margin:10,
	marginTop:0,
	padding:5
},
card:{
	borderWidth:2,
	marginLeft:5,
	marginRight:5,
	marginBottom:5,
	padding:10,
	height:300,
	justifyContent:'flex-end'
},
downloadButton:{
	backgroundColor:'#3498db',
	borderWidth:2,
	borderColor:'#2980b9',
	width:100,
	padding:5,
	paddingLeft:10,
	paddingRight:10,
	color:'white',
	borderRadius: 10,
	textAlign: 'center'
},
footer:{
	backgroundColor:'#eee',
	margin:10,
	marginTop:0,
	padding:10,
	marginBottom:0,
	borderTopLeftRadius: 20,
	borderTopRightRadius: 20
}
})
export default App;