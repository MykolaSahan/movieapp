import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import tmdbApi from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";

import "./detail.scss";
import CastList from "./CastList";
import VideoList from "./VideoList";
import MovieList from '../../components/movie-list/MovieList';

import { formatNumber } from '../../utilities/formatnumber';

const Detail = () => {
  const { category, id } = useParams();
  
  const [item, setItem] = useState(null);

  useEffect(() => {
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, { params: {} });
      setItem(response);
      window.scrollTo(0, 0);
      console.log(response);
    };
    getDetail();

  }, [category, id]);

  return (
    <>
      {
        item && (
          <>
            <div
              className="banner"
              style={{
                backgroundImage: `url($${apiConfig.originalImage(item.backdrop_path || item.poster_path)})`,
              }}
            ></div>
            <div className="mb-3 movie__content container">
              <div className="movie__content--poster">
                <div className="movie__content--poster-img" style={{ backgroundImage: `url(${apiConfig.originalImage(item.poster_path || item.backdrop_path)})` }}></div>
              </div>

              <div className="movie__content--info">
                <h1 className="title">
                  { item.title || item.name }
                  <i className="bx bx-link"></i>
                  <p>{ item.tagline || '' }</p>
                </h1>
                <div className="genres">
                  {
                    item.genres && item.genres.slice(0, 5).map((genre, i) => (
                      <span className="genres__item" key={i}>{ genre.name }</span>
                    ))
                  }
                </div>
                <div className="realease__data">
                  <p><b>Realese date: </b>{ item.release_date }</p>
                </div>
                <div className="budget">
                  <p><b>Budget:</b> $ { formatNumber(item.budget) }</p>    
                  <p><b>Revenue:</b> $ {formatNumber(item.revenue)}</p>
                  <p><b>Rating: </b><i className="bx bxs-star"></i> {item.vote_average} ({item.vote_count})</p>
                </div>
                <p className="overview">
                  { item.overview }
                </p>
                <div className="cast">
                  <div className="section__header">
                    <h2>Casts</h2>
                  </div>
                  <CastList id={item.id} />
                </div>
                <div className="countries">
                  <b>Production Countries:</b> <br /><br />
                  {
                    item.production_countries && item.production_countries.slice(0, 5).map((item, i) => (
                      <span className="countries__item" key={i}>{ item.name }</span>
                    ))
                  }
                </div>
                <div className="companies">
                  <b>Production Companies:</b> <br /><br />
                  {
                    item.production_companies && item.production_companies.slice(0, 3).map((item, i) => (
                      <span className="companies__item" key={i}>{ item.name }</span>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="container">
              <div className="section mb-3">
                  <VideoList id={item.id} />
              </div>
              <div className="section mb-3">
                <div className="section__header mb-2">
                  <h2>Similar</h2>
                </div>
                <MovieList category={category} type="similar" id={item.id} />
              </div>
            </div>
          </>
        )
      }
    </>
  );
};

export default Detail;
