import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [followers, setFollowers] = useState([]);

  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    const response = await axios
      .get(`${rootUrl}/users/${user}`)
      .catch((err) => console.log(err));
    if (response) {
      setGithubUser(response.data);

      // await Promise.allSettled([
      //   axios.get(`${rootUrl}/users/${login}/repos?per_page=100`),
      //   axios.get(`${followers_url}?per_page=100`),
      // ])
      //   .then((results) => {
      //     const [repos, followers] = results;
      //     const status = "fullfilled";
      //     if (repos.status === status) {
      //       setRepos(repos.value.data);
      //     }
      //     if (followers.status === status) {
      //       setRepos(followers.value.data);
      //     }
      //   })
      //   .catch((err) => console.log(err));
      const { login, followers_url } = response.data;
      axios
        .get(`${rootUrl}/users/${login}/repos?per_page=100`)
        .then(({ data }) => {
          setRepos(data);
        });
      axios.get(`${followers_url}?per_page=100`).then(({ data }) => {
        setFollowers(data);
      });
    } else {
      toggleError(true, "there is no user found.");
    }
    checkRequests();
    setIsLoading(false);
  };

  const checkRequests = () => {
    axios
      .get(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, "Sorry you've exceeded rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  useEffect(() => {
    checkRequests();
  }, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        isLoading,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
