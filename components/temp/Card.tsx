import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
export type CardType = {
  id: string;
  title: string;
};

const Card: FC<CardType> = ({ id, title }) => {

  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id
  });

  const style = {
    margin: "10px",
    opacity: 1,
    color: "#333",
    background: "white",
    padding: "10px",
  };

  return (

    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div id={id}>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default Card;
