const Trash = () => {
  return (
    <div>
      <p>
        all files deleted, stored here, create additional column for DB
        isDeleted:true/false
      </p>
      <p>
        create column timestamp since date deleted, date deleted - current date
        if over 30 days delete the file
      </p>
    </div>
  );
};
export default Trash;
