import React, { useContext, useEffect } from "react";
import Axios from "axios";
import { useImmer } from "use-immer";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx";
import LinkedPost from "./LinkedPost.jsx";

function Search() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [searchState, setSearchState] = useImmer({
    input: state.search.input || "",
    results: state.search.results || [],
    searchRequestCount: 0,
    loading: false
  });

  useEffect(() => {
    document.addEventListener('keyup', handleKeyPress);
      return () => {
        document.removeEventListener('keyup', handleKeyPress);
      };
  }, []);
  
  useEffect(() => {
    let typingTimeout;
    if (searchState.input.trim() === "") {
      setSearchState(draft => {
        draft.results = [];
        draft.loading = false;
      });
    } else if (state.search.input !== searchState.input) {
        setSearchState(draft => {
          draft.loading = true;
        });
      
        typingTimeout = setTimeout(function startSearching() {
          setSearchState(draft => {
            draft.searchRequestCount++;
            draft.loading = true;
          });
        }, 800);  
      
      return () => {
        clearTimeout(typingTimeout);
      };
    }
  }, [searchState.input]);

  useEffect(() => {
    dispatch({ 
      type: "updateSearchData", 
      value: { 
        input: searchState.input,
        results: searchState.results
      } 
    });
  }, [searchState.results]);

  useEffect(() => {
    if (searchState.searchRequestCount) {
      const req = Axios.CancelToken.source();
      async function fetchSearchResults() {
        try {
          await Axios.post("/search", {
            searchTerm: searchState.input
          }, {
            cancelToken: req.token  
          }).then(res => {
            setSearchState(draft => {
              draft.results = res.data;
              draft.loading = false;
            });
          });
        } catch (error) {
          console.log("There Was An Issue Completing Your Search Request!", error);
        }
      }

      if (searchState.input.trim() !== "") fetchSearchResults();

      return () => {
        req.cancel();
      };
    }
  }, [searchState.searchRequestCount]);

  function handleTyping(e) {
    e.preventDefault();
    const value = e.target.value;
    setSearchState(draft => {
      draft.input = value
    });
  }

  function handleKeyPress(e) {
    if (e.keyCode === 27) handleCloseSearch(e);
  }
  
  function handleCloseSearch(e) {
    e.preventDefault();
    dispatch({ 
      type: "updateSearchData", 
      value: { 
        input: "",
        results: []
      } 
    });
    dispatch({ type: "toggleSearch" });
  }

  return (
      <div className="search-overlay">
        <div className="search-overlay-top shadow-sm">
          <div className="container container--narrow">
            <label htmlFor="live-search-field" className="search-overlay-icon">
              <i className="fas fa-search search-icon"></i>
            </label>
            <input autoFocus value={searchState.input} onChange={handleTyping} type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder={"Search for Posts"} />
            <span onClick={handleCloseSearch} className="close-live-search">
              <i className="fas fa-times-circle"></i>
            </span>
          </div>
        </div>

        <div className="search-overlay-bottom">
          <div className="container container--narrow py-3">
            <div className={"circle-loader" + (searchState.loading ? " circle-loader--visible" : "")}></div>
            <div className={"live-search-results" + (!searchState.loading ? " live-search-results--visible" : "")}>
              <div className="list-group shadow-sm">
                {
                  searchState.results.length > 0 && (
                    <div className="list-group-item search-results-header">
                      <strong>Search Results</strong> ({searchState.results.length} {searchState.results.length > 1 ? "items" : "item"} found)
                    </div>
                  )
                }
                {
                  searchState.results.map(post => <LinkedPost post={post} key={post["_id"]} otherAuthor={post.author.username !== state.user.username} />)
                }
              </div>
              {
                !searchState.results.length && searchState.input.trim() !== "" && !searchState.loading && <p className="alert alert-danger text-center shadow-sm">We could not find any posts that match your search query!</p>
              }
            </div>
          </div>
        </div>
      </div>
  );
}

export default Search;
