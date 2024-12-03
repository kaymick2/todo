import React from 'react';
import {useEffect, useState} from 'react';

const App = () => {
	
  useEffect(() => {
  setIsLoading(true);
  try {
      fetchTheData();
    }
  catch{setIsError(true)};
}, []);

   async function fetchTheData() {
    const response=await fetch(`https://09kjtgt235.execute-api.us-east-2.amazonaws.com/dev/reading?id=dd2436ca-638d-4516-85b2-4de269157347&user=kay`);
    const result=await response.json();
    console.log(result);
    setListItems(result);
    setIsLoading(false);
  }


  // hook for the current list of items #1
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [listItems,setListItems]=useState([]);
    const [inputValue,setInputValue]=useState('');
function buttonHandler(){
  try {
    writeTheData(inputValue);
    setInputValue('');
    window.location.reload();
  } catch (error) {
   console.error("eat mah nutz");  
  }
}
const handleTextChange = (event) => {
  setInputValue(event.target.value);
};

async function writeTheData(item){
  const encodeItem=encodeURIComponent(item);
  setIsLoading(true);
  const response=await fetch(`https://s5j1zlnq76.execute-api.us-east-2.amazonaws.com/test/writing?user=kay&text=${encodeItem}`);
  const result=await response.json();
  console.log(result);
  setIsLoading(false);
  
}
const deleteItem = async (id,text) => {
  setIsLoading(true);
  try {
    const deleteUndo=text;
    await fetch(`https://cc9vathen7.execute-api.us-east-2.amazonaws.com/dev/deleting?user=kay&id=${id}`);
    setListItems((prevItems) => prevItems.filter(item => item.id !== id));
    window.location.reload();
  } catch (error) {
    console.error("An error occurred while deleting data");
  } finally {
    setIsLoading(false);
  }
}; 
  return (
    <div>
      <h3>Reading my Database</h3>
      <input type='text'onChange={handleTextChange} value={inputValue} placeholder='enter shit here'></input>
      <button onClick={buttonHandler}>ADD STUFF</button>
    {isError && <p>Erroneous state ...</p>}
    
    {isLoading ? (
        <p>fingering jeff bezos...</p>
      ) :
       
      <ul>
          {listItems.map((item, index) => (
            <li key={index}>
              {item.text}
              <button onClick={() => deleteItem(item.id)}>X
              </button>
            </li>
          ))}
        </ul>
    }
    </div>
   );
};

export default App;