import React, { useEffect, useState } from 'react';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [deletedItem, setDeletedItem] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);

async function fetchTheData(){
    setIsLoading(true);
    try {
      const response = await fetch(`https://09kjtgt235.execute-api.us-east-2.amazonaws.com/dev/reading?id=dd2436ca-638d-4516-85b2-4de269157347&user=kay`);
      const result = await response.json();
      setListItems(result);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheData();
  }, [updateTrigger]);

  const handleTextChange = (event) => {
    setInputValue(event.target.value);
  };

  const buttonHandler = async () => {
    try {
      await writeTheData(inputValue);
      setInputValue('');
      setUpdateTrigger(prev => !prev); // Toggle the state to trigger useEffect
    } catch (error) {
      console.error("An error occurred while writing data");
    }
  };

  const undoDelete = async () => {
    try {
      if (deletedItem) {
        await writeTheData(deletedItem.text);
        setDeletedItem(null);
        setUpdateTrigger(prev => !prev); // Trigger useEffect to update the list
      }
    } catch (error) {
      console.error("An error occurred while undoing delete");
    }
  };

  const writeTheData = async (text) => {
    const encodeItem = encodeURIComponent(text);
    setIsLoading(true);
    try {
      const url = `https://s5j1zlnq76.execute-api.us-east-2.amazonaws.com/test/writing?user=kay&text=${encodeItem}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      const result = await response.json();
      return { id: result.id, text }; // Assuming the API returns the new item's ID
    } catch (error) {
      console.error("An error occurred while writing data");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  async function deleteItem (id, text) {
    setIsLoading(true);
    try {
      setDeletedItem({ id, text });
      const response = await fetch(`https://cc9vathen7.execute-api.us-east-2.amazonaws.com/dev/deleting?user=kay&id=${id}`, {
       mode:'no-cors'
      });
      if (!response.status===0){
        console.info("Expected opaque response (code 0) and got something else. You may want to refresh the page.");
      }
    } catch (error) {
      console.error("An error occurred while deleting data");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteItem = async (id,text) => {
    try {
      await deleteItem(id,text); // Wait for the deletion to complete
      await fetchTheData(); // Refresh the list of items after deletion
    } catch (error) {
      setIsError(true); // Handle any error in deleting the item
    }
  };
  return (
    <div>
      <h1>DataSoBased</h1>
      <input type="text" value={inputValue} onChange={handleTextChange} />
      <button onClick={buttonHandler}>ADD STUFF</button>
      {deletedItem && <button onClick={undoDelete}>UNDO DELETE</button>}
      {isError && <p>Erroneous state ...</p>}
      {isLoading ? (
        <p>Fingering Jeff Bezos...</p>
      ) : (
        <ul>
          {listItems.map((item, index) => (
           <li key={index}>
           {item.text}
           <button 
             style={{ marginLeft: '10px' }} 
             onClick={() => handleDeleteItem(item.id, item.text)}
           >
             X
           </button>
         </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;