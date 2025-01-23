import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access the location object
import { getApi } from "../API";

function Search(props) {
  const location = useLocation(); // Get the location object
  const searchParams = new URLSearchParams(location.search); // Use URLSearchParams to parse the query string
  const search = searchParams.get("search"); // Get the 'search' parameter from the query string
  const [data, setData] = useState([]);

  useEffect(() => {
    if (search) {
      getApi("/trade/search-stock", {
        search: search || "",
      }).then((res) => {
        setData(res.data);
      });
    }
  }, [search]);

  return (
    <div className="flex flex-col min-h-screen gap-4 p-8 bg-gray-50">
      {data.map((doc, i) => (
        <Card
          company={doc.shortname}
          ex={doc.exchDisp}
          score={doc.score}
          symbol={doc.symbol}
        />
      ))}
      {search && <div>Search Query: {search}</div>}{" "}
      {/* Display the search query */}
    </div>
  );
}

export default Search;

const Card = ({ company, ex, score, symbol }) => {
  return (
    <div className="grid grid-cols-2 px-3 py-4 bg-gray-200">
      <div>
        <div className="text-xl font-bold">{company}</div>
        <div>{ex}</div>
      </div>
      <div>
        <div>
          <span className="font-medium">Score: </span>
          {score}
        </div>
        <div>
          <span className="font-medium">Symbol: </span>
          {symbol}
        </div>
      </div>
    </div>
  );
};
