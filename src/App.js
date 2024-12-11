import React, { useEffect, useState } from 'react';
import UpdateModal from './UpdateModal';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  async function fetchTheData() {
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
  }

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
      setUpdateTrigger((prev) => !prev);
    } catch (error) {
      console.error("An error occurred while writing data");
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
      return { id: result.id, text };
    } catch (error) {
      console.error("An error occurred while writing data");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  async function deleteItem(id, text) {
    setIsLoading(true);
    try {
      const response = await fetch(`https://cc9vathen7.execute-api.us-east-2.amazonaws.com/dev/deleting?user=kay&id=${id}`, {
        mode: 'no-cors',
      });
      if (!response.status === 0) {
        console.info("Expected opaque response (code 0) and got something else. You may want to refresh the page.");
      }
    } catch (error) {
      console.error("An error occurred while deleting data");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteItem = async (id, text) => {
    try {
      await deleteItem(id, text);
      await fetchTheData();
    } catch (error) {
      setIsError(true);
    }
  };

  const handleEditItem = (item) => {
    setCurrentEditItem(item);
    setIsModalOpen(true);
  };

  const handleUpdate = async (id, newText) => {
    try {
      const encodeText = encodeURIComponent(newText);
      const url = `https://wk1jgumzl6.execute-api.us-east-2.amazonaws.com/dev/updating?text=${encodeText}&id=${id}&user=kay`;
      await fetch(url, { method: 'GET' });
      setIsModalOpen(false);
      await fetchTheData(); // Refetch data immediately after update
    } catch (error) {
      console.error("An error occurred while updating the item", error);
    }
  };

  const listItems1 = listItems.map(item => (
    <div key={item.id}>
      <button onClick={() => handleEditItem(item)} style={{ width: '150px' }}>{item.text}</button>
      <button onClick={() => handleDeleteItem(item.id, item.text)}>remove</button>
    </div>
  ));

  return (
    <div>
      <h1>DataSoBased</h1>
      <input type="text" value={inputValue} onChange={handleTextChange} />
      <button onClick={buttonHandler}>ADD STUFF</button>
      {isError && <p>Erroneous state ...</p>}
      {isLoading ? (
        <p>Fingering Jeff Bezos...</p>
      ) : (
        <div>{listItems1}</div>
      )}
{isModalOpen && (
  <UpdateModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onUpdate={handleUpdate}
    item={currentEditItem}
  />
)}
    </div>
  );
};

export default App;
