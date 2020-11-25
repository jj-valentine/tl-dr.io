import React, { useContext, useState, useEffect } from "react";
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
    searchRequestCount: 0
  });

  useEffect(() => {
    document.addEventListener('keyup', handleKeyPress);
      return () => {
        document.removeEventListener('keyup', handleKeyPress);
      };
  }, []);
  
  useEffect(() => {
    const typingTimeout = setTimeout(function startSearching() {
      setSearchState(draft => {
        draft.searchRequestCount++;
      })
    }, 2000);

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [searchState.input]);

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
              draft.results = res.data
            });
          })
        } catch (error) {
          console.log("There Was An Issue Completing Your Search Request!", error);
        }
      }
      if (searchState.input.trim()) fetchSearchResults();
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
    if (e.keyCode === 27) handleToggleSearch(e);
  }
  
  function handleToggleSearch(e) {
    e.preventDefault();
    if (state.search.isOpen) {
      dispatch({ 
        type: "updateSearchData", 
        value: { 
          input: searchState.input,
          results: searchState.results
        } 
      });
    }
    dispatch({ type: "toggleSearch" });
  }

  return (
    <>
      <div className="search-overlay">
        <div className="search-overlay-top shadow-sm">
          <div className="container container--narrow">
            <label htmlFor="live-search-field" className="search-overlay-icon">
              <i className="fas fa-search"></i>
            </label>
            <input autoFocus value={searchState.input} onChange={handleTyping} type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder={"Search for Posts"} />
            <span onClick={handleToggleSearch} className="close-live-search">
              <i className="fas fa-times-circle"></i>
            </span>
          </div>
        </div>

        <div className="search-overlay-bottom">
          <div className="container container--narrow py-3">
            <div className="live-search-results live-search-results--visible">
              <div className="list-group shadow-sm">
                {
                  searchState.results.length > 0 && (
                    <div className="list-group-item active">
                      <strong>Search Results</strong> ({searchState.results.length} items found)
                    </div>
                  )
                }
                {
                  searchState.results.map(post => <LinkedPost post={post} key={post["_id"]} otherAuthor={post.author.username !== state.user.username} />)
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
