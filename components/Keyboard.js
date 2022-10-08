const Keyboard = (props) => {
  var txt = "";
  const arr = [];
  !!props.text ? (txt = props.text.split(",")) : (txt = props.word.split(","));
  for (var i = 0; i < txt?.length; i++) {
    arr.push(
      <div
        className={
          txt[i].length <= 1 ? "btn" : txt[i].length < 8 ? "btn-md" : "btn-long"
        }
        key={i}
      >
        {txt[i]}
      </div>
    );
  }
  return <div className="flex gap-0.5">{arr}</div>;
};

export default Keyboard;
