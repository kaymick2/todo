import React, { useEffect, useState } from 'react';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [deletedItem, setDeletedItem] = useState(null);

  useEffect(() => {
    const fetchTheData = async () => {
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

    fetchTheData();
  }, []);

  const handleTextChange = (event) => {
    setInputValue(event.target.value);
  };

  const buttonHandler = async () => {
    try {
      await writeTheData(inputValue);
      setInputValue('');
      window.location.reload();
    } catch (error) {
      console.error("An error occurred while writing data");
    }
  };

  const undoDelete = async () => {
    try {
      if (deletedItem) {
        await writeTheData(deletedItem.text);
        setDeletedItem(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("An error occurred while undoing delete");
    }
  };

  const writeTheData = async (item) => {
    const encodeItem = encodeURIComponent(item);
    setIsLoading(true);
    try {
      const response = await fetch(`https://s5j1zlnq76.execute-api.us-east-2.amazonaws.com/test/writing?user=kay&text=${encodeItem}`);
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("An error occurred while writing data");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id, text) => {
    setIsLoading(true);
    try {
      setDeletedItem({ id, text });
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
      <h1>Reading my Database</h1>
      <input type="text" value={inputValue} onChange={handleTextChange} />
      <button onClick={buttonHandler}>ADD STUFF</button>
      {deletedItem && <button onClick={undoDelete}>UNDO DELETE</button>}
      {isError && <p>Erroneous state ...</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {listItems.map((item, index) => (
            <li key={index}>
              {item.text}
              <button onClick={() => deleteItem(item.id, item.text)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;