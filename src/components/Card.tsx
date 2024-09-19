"use client";

import React from "react";
import ArrowButton from "./ArrowButton";
import HeartButton from "./HeartButton";
import { truncateText } from "@/data/troncateText";
import Link from "next/link";

interface CardProps {
  backgroundColor: string;
  title: string | undefined;
  imageSrc: string | undefined;
  size?: "small" | "large";
  link?: React.ReactNode;
  eventId: number; // Passa l'ID dell'evento come prop
  onHeartClick?: () => void;
  isLiked?: boolean; // Nuova prop per gestire lo stato del cuoricino
  dateEnd: string | undefined;
  dateStart: string | undefined;
  price: string | undefined;
  description?: string | undefined;
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
  onHeartClick,
  dateEnd,
  dateStart,
  price,
  description,
}) => {

  const sizeClasses =
    size === "large" ? "max-w-md h-[300px]" : "max-w-xs h-[200px]";
    const dynamicBackgroundColor = eventId === 1 
    ? "#FFD700" // Usa il colore oro per l'id 1
    : backgroundColor;

    return (
      <div
        className={`overflow-hidden shadow-lg relative cursor-pointer ${sizeClasses}`}
        style={{ backgroundColor: dynamicBackgroundColor, minHeight: "300px" }} // Imposta una min-height per garantire spazio
      >
        {size === "large" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Sezione Immagine per Card Grande */}
            <div className="relative flex items-center overflow-hidden">
              <img
                src={imageSrc}
                alt={title}
                className="object-cover w-full h-[300px] md:h-full"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <HeartButton
                  onClick={onHeartClick}
                  title={title}
                  image={imageSrc}
                  eventId={eventId}
                  color={backgroundColor}
                  isLiked={isLiked}
                />
              </div>
            </div>
            {/* Sezione Testo per Card Grande */}
            <Link href={`/events/${eventId}`}>
              <div
                className="diagonal-line-container p-6 flex flex-col justify-between text-white relative"
                style={{ backgroundColor }}
              >
                <h2 className="text-[20px] font-titolo underline-on-hover">
                  {title ? truncateText(title, 10) : "No title"}
                </h2>
                <p className="text-[14px] font-sans mt-2">
                  {description  ? description : "No description"}
                </p>
                <p className="text-[12px] font-sans mt-2">
                  {dateEnd}
                  {dateStart}
                  {price}
                </p>
                <div className="absolute bottom-4 right-4 cursor-pointer">
                  <ArrowButton />
                </div>
              </div>
            </Link>
          </div>
        ) : (
          // Layout per card piccole
          <div>
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
                  eventId={eventId} // Passa l'ID dell'evento a HeartButton
                  color={backgroundColor}
                  isLiked={isLiked} // Passa lo stato del 
                />
              </div>
            </div>
            <Link href={`/events/${eventId}`}>
              <div
                className="diagonal-line-container p-3 text-white relative"
                style={{ backgroundColor }}
              >
                <div className="diagonal-line-top"></div>
                <h2 className="h-[50px] text-[16px] font-titolo mt-4">
                  {title ? truncateText(title, 10) : "No title"}
                </h2>
                <p className="text-[12px] font-sans mt-2">
                  {dateEnd}
                  {dateStart}
                  {price}
                </p>
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
            </Link>
          </div>
        )}
      </div>
    );
};

export default Card;