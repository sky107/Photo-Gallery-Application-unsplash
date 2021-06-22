import React from 'react';
import {Text,Alert,Modal,View} from 'react-native';
import GalleryScreen from './screens/GalleryScreen';
const App=()=>{

const [modal,setModal]=React.useState(false);

return (
<>
<GalleryScreen/>
</>);
}

export default App;