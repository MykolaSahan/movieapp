import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";

import Button, { OutlineButton } from "../button/Button";
import Modal, { ModalContent } from "../modal/Modal";

import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import apiConfig from "../../api/apiConfig";

import tmdbApi, { category, movieType } from "../../api/tmdbApi";
import "./hero-slide.scss";

const HeroSlide = () => {
  SwiperCore.use([Autoplay]);

  const [movieItems, setMovieItems] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      const params = { page: 1 };
      try {
        const response = await tmdbApi.getMoviesList(movieType.popular, {
          params,
        });
        setMovieItems(response.results.slice(1, 5));
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getMovies();
  }, []);
  return (
    <div className="hero__slide">
      <Swiper
        modules={[Autoplay]}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        loop={true}
      >
        {movieItems.map((item, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <HeroSlideItem
                item={item}
                className={`${isActive ? "active" : ""}`}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {movieItems.map((item, i) => (
        <TrailerModal key={i} item={item} />
      ))}
    </div>
  );
};

const HeroSlideItem = (props) => {
  let history = useHistory();

  const item = props.item;

  const background = apiConfig.originalImage(
    item.backdrop_path ? item.backdrop_path : item.poster_path
  );

  const setModalActive = async () => {
    const modal = document.querySelector(`#modal__${item.id}`);

    const videos = await tmdbApi.getVideos(category.movie, item.id);

    if (videos.results.length > 0) {
      const videSrc = `https://www.youtube.com/embed/${videos.results[0].key}`;
      modal
        .querySelector(`.modal__content > iframe`)
        .setAttribute("src", videSrc);
    } else {
      modal.querySelector(`.modal__content`).innerHTML = "No trailer";
    }

    modal.classList.toggle("active");
  };

  return (
    <div
      className={`hero__slide--item ${props.className}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="hero__slide--item-content container">
        <div className="hero__slide--item-content-info">
          <h2 className="title">{item.title}</h2>
          <div className="overview">{item.overview}</div>
          <div className="btns">
            <Button onClick={() => history.push(`/movie/${item.id}`)}>
              Watch now
            </Button>
            <OutlineButton onClick={setModalActive}>
              Watch trailer
            </OutlineButton>
          </div>
        </div>
        <div className="hero__slide--item-content-poster">
          <img src={apiConfig.w500Image(item.poster_path)} alt="" />
        </div>
      </div>
    </div>
  );
};

const TrailerModal = (props) => {
  const item = props.item;

  const iframeRef = useRef(null);

  const onClose = () => {
    return iframeRef.current.setAttribute("src", "");
  };

  return (
    <Modal active={false} id={`modal__${item.id}`}>
      <ModalContent onCLose={onClose}>
        <iframe
          ref={iframeRef}
          title="trailer"
          width="100%"
          height="500px"
        ></iframe>
      </ModalContent>
    </Modal>
  );
};

export default HeroSlide;
