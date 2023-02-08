import "./styles/App.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useEffect } from "react";
import AnimeCard from "./Components/AnimeCard";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import FilterBar from "./Components/FilterBar";
import NothingFound from "./Components/NothingFound";
import PaginationBar from "./Components/PaginationBar";

function App() {
    // reset title value to original state when at home page
    document.title = "Anime Search | By Umikami";

    const navigate = useNavigate();
    const [animeList, setAnimeList] = useState([]);

    const { animeTitle, pageId } = useParams();

    const handleSubmit = (submitEvent) => {
        submitEvent.preventDefault();
        let inputVal = submitEvent.target[0].value;
        navigate(`/search/${inputVal}`);
    };

    const filterAnime = (genre, year, animeType) => {
         axios
            .get(
                `https://kitsu.io/api/edge/anime?page[limit]=20${genre && `&filter[categories]=${genre}`}${year ? `&filter[seasonYear]=${year}` : ""}${animeType && `&filter[subtype]=${animeType}`}`
            )
            .then((res) => {
                setAnimeList(res.data.data);
            })
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        axios
            .get(
                `https://kitsu.io/api/edge/anime?page[limit]=20${
                    animeTitle
                        ? "&filter[text]=" + animeTitle
                        : pageId
                        ? "&page[offset]=" + (pageId - 1) * 20
                        : ""
                }`
            )
            .then((res) => {
                setAnimeList(res.data.data);
            })
            .catch((error) => console.log(error));
    }, [animeTitle, pageId]);

    // console.log(animeList);

    return (
        <div className="App">
            <div className="container mt-5">
                <Navbar />
                <form className="d-flex" role="search" onSubmit={handleSubmit}>
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-success" type="submit">
                        Search
                    </button>
                </form>

                <FilterBar applyFilters={filterAnime}/>

                <div className="row mx-0 mt-4" style={{ maxWidth: "100%" }}>
                    {animeList.length !== 0
                        ? animeList.map((anime) => {
                              return <AnimeCard anime={anime} key={uuidv4()} />;
                          })
                        : <NothingFound/>}
                </div>
                <PaginationBar animeList={animeList} pageId={pageId}/>
            </div>
        </div>
    );
}

export default App;
