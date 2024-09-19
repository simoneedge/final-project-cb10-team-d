"use client";

import React from "react";
import ArrowButton from "./ArrowButton";
import HeartButton from "./HeartButton";
import { truncateText } from "@/data/troncateText";

interface CardProps {
  backgroundColor: string;
  title: string | undefined;
  imageSrc: string | undefined;
  size?: "small" | "large";
  link?: React.ReactNode;
  eventId: number; // Passa l'ID dell'evento come prop
  onHeartClick?: () => void;
  isLiked?: boolean; // Nuova prop per gestire lo stato del cuoricino
}
/* cooment */
const Card: React.FC<CardProps> = ({
  backgroundColor,
  title,
  imageSrc,
  size = "small",
  link,
  eventId,
  isLiked = false,
  onHeartClick
}) => {

  const sizeClasses =
    size === "large" ? "max-w-md h-[300px]" : "max-w-xs h-[200px]";

  return (
    <div
      className={`overflow-hidden shadow-lg relative ${size === "large" ? "max-w-md" : "max-w-xs"
        }`}
    >
      <div className="relative">
        <div className="clip-path-bottom">
          <img
            src={imageSrc}
            alt={title}
            className={`object-cover w-full ${sizeClasses}`}
          />
        </div>
        <div className="absolute top-2 right-2 flex space-x-2">
          <HeartButton
            onClick={onHeartClick}
            title={title}
            image={imageSrc}
            eventId={eventId}  // Passa l'ID dell'evento a HeartButton
            color={backgroundColor}
            isLiked={isLiked} // Passa lo stato del 
          />
        </div>
      </div>
      <div
        className="diagonal-line-container p-3 text-white relative"
        style={{ backgroundColor }}
      >
        <div className="diagonal-line-top"></div>
        <h2 className="h-[50px] text-[16px] font-titolo mt-4"> {title ? truncateText(title, 10) : "No title"}</h2>
        <div className="absolute bottom-2 right-2 cursor-pointer">
          {link ? (
            link // Se il Link è passato come prop, renderizzalo
          ) : (
            <div>
              <ArrowButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;