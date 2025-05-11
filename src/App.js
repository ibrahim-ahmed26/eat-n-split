import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=118838",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=118839",
    balance: 0,
  },
];
function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [addFriends, setAddFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleShowAddFriend() {
    setShowAddFriend((isOpen) => !isOpen);
  }
  function addFriend(friends) {
    setAddFriends((pervFriend) => [...pervFriend, friends]);
  }
  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleBill(amountInput) {
    const amount = parseFloat(amountInput);
    setSelectedFriend((friend) => ({
      ...friend,
      balance: friend.balance + amount,
    }));

    setAddFriends((prevFriends) =>
      prevFriends.map((f) =>
        f.id === selectedFriend.id ? { ...f, balance: f.balance + amount } : f
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={addFriends}
          selectedFriend={selectedFriend}
          onHandleSelection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={addFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          selectedFriend={selectedFriend}
          onHandleBill={handleBill}
        />
      )}
    </div>
  );
}
function FriendList({ friends, onHandleSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onHandleSelection={onHandleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onHandleSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p> you and {friend.name} are even</p>}
      <Button onClick={() => onHandleSelection(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(
    "https://api.dicebear.com/7.x/adventurer/svg?seed=118839"
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;

    const id = crypto.randomUUID();
    const randomSeed = Math.random().toString(36).substring(2, 10); // Random string
    const randomImage = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;

    const newFriend = {
      name,
      balance: 0,
      id,
      image: randomImage, // use the random DiceBear avatar
    };

    onAddFriend(newFriend);

    // Optionally reset the form
    setName("");
    setImage("https://api.dicebear.com/7.x/adventurer/svg?seed=118839");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        disabled
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onHandleBill }) {
  const [bill, setBill] = useState("");
  const [paid, setPaid] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const numberPaid = bill ? bill - paid : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!paid || !bill) return;
    onHandleBill(whoIsPaying === "user" ? numberPaid : -numberPaid);
    // Reset form values after submission
    setBill("");
    setPaid("");
    setWhoIsPaying("user");
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split a bill with {selectedFriend.name}</h2>
      <label>💵bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your Expense</label>
      <input
        type="text"
        value={paid}
        onChange={(e) =>
          setPaid(Number(e.target.value)) > bill
            ? paid
            : setPaid(Number(e.target.value))
        }
      />
      <label>🧑{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={numberPaid} />
      <label>🤑 who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
