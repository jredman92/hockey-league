import React, { useEffect, useState } from "react";

const Skaters = ({ searchQuery }) => {
   const [jsonData, setJsonData] = useState({ players: [] });
   const [filteredResults, setFilteredResults] = useState([]);
   const [sortColumn, setSortColumn] = useState(""); // State for the column to sort by
   const [sortedColumn, setSortedColumn] = useState(""); // Highlight column being sorted
   const [sortDirection, setSortDirection] = useState("asc"); // State for sorting direction

   useEffect(() => {
      async function fetchData() {
         try {
            const response = await fetch("../data/skaterData.json");
            if (!response.ok) {
               throw new Error("Network response failed");
            }
            const data = await response.json();
            setJsonData(data);
         } catch (error) {
            console.error("Error retrieving data:", error);
         }
      }
      fetchData();
   }, []);

   const handleSort = (columnName) => {
      setSortColumn(columnName);
      setSortDirection((prevSortDirection) =>
         prevSortDirection === "asc" ? "desc" : "asc"
      );

      setSortedColumn(columnName); // Set the currently sorted column

      setFilteredResults((prevFilteredResults) => {
         return [...prevFilteredResults].sort((a, b) => {
            const aValue = a[columnName];
            const bValue = b[columnName];

            if (typeof aValue === "string" && typeof bValue === "string") {
               // Use String localeCompare for string values
               return sortDirection === "asc"
                  ? aValue.localeCompare(bValue)
                  : bValue.localeCompare(aValue);
            } else {
               // Use numeric comparison for numeric values
               return sortDirection === "asc"
                  ? aValue - bValue
                  : bValue - aValue;
            }
         });
      });
   };

   const getSortedResults = () => {
      if (sortColumn) {
         const comparator = (a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (typeof aValue === "string" && typeof bValue === "string") {
               // Use String localeCompare for string values
               return sortDirection === "asc"
                  ? aValue.localeCompare(bValue)
                  : bValue.localeCompare(aValue);
            } else {
               // Use numeric comparison for numeric values
               return sortDirection === "asc"
                  ? aValue - bValue
                  : bValue - aValue;
            }
         };

         return [...filteredResults].sort(comparator);
      }
      return filteredResults;
   };

   useEffect(() => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = jsonData.players.filter((player) =>
         player.player.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredResults(filtered);
   }, [searchQuery, jsonData.players]);

   const sortedResultsData = getSortedResults();

   const renderTableHeader = (column, label, hoverText) => (
      <th
         key={column}
         className={`text-left py-2 px-3 bg-gray-800 text-white ${
            sortColumn === column ? "sorted" : ""
         }`}
         title={hoverText}
         onClick={() => handleSort(column)}
      >
         <div className="header-content">
            <span>{label}</span>
            {sortColumn === column && sortDirection === "asc" && (
               <span>&nbsp;▲</span>
            )}
            {sortColumn === column && sortDirection === "desc" && (
               <span>&nbsp;▼</span>
            )}
         </div>
      </th>
   );

   return (
      <div>
         <div className="container mx-auto px-5 py-5">
            <div className="overflow-x-auto">
               {sortedResultsData.length > 0 ? (
                  <table className="min-w-full bg-white table-bordered">
                     <colgroup className="player-colgroup">
                        <col
                           className="player-col"
                           style={{ width: "250px" }}
                        />
                        <col
                           className="player-col"
                           style={{ width: "200px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                        <col
                           className="player-col-noBorder"
                           style={{ width: "100px" }}
                        />
                     </colgroup>
                     <thead>
                        <tr>
                           {renderTableHeader("player", "Player", "Player")}
                           {renderTableHeader("team", "Team", "Team")}
                           {renderTableHeader("position", "Pos", "Position")}
                           {renderTableHeader(
                              "gamesPlayed",
                              "GP",
                              "Games Played"
                           )}
                           {renderTableHeader("goals", "G", "Goals")}
                           {renderTableHeader("assists", "A", "Assists")}
                           {renderTableHeader("points", "P", "Points")}
                           {renderTableHeader(
                              "pointsPerGame",
                              "P/G",
                              "Points Per Game"
                           )}
                           {renderTableHeader(
                              "overtimeGoals",
                              "OTG",
                              "Overtime Goals"
                           )}
                           {renderTableHeader(
                              "gameWinningGoals",
                              "GWG",
                              "Game Winning Goals"
                           )}
                           {renderTableHeader("shots", "S", "Shots")}
                           {renderTableHeader(
                              "shootingPercentage",
                              "S%",
                              "Shooting Percentage"
                           )}
                        </tr>
                     </thead>

                     <tbody>
                        {sortedResultsData.map((player, index) => (
                           <tr
                              key={index}
                              className={`${
                                 index % 2 === 0 ? "even-row" : "odd-row"
                              }`}
                           >
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "player"
                                       ? "sorted-odd"
                                       : ""
                                 }`}
                              >
                                 {player.player}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "team" ? "sorted-even" : ""
                                 }`}
                              >
                                 {player.team}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "position"
                                       ? "sorted-odd"
                                       : ""
                                 }`}
                              >
                                 {player.position}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "gamesPlayed"
                                       ? "sorted-column"
                                       : ""
                                 }`}
                              >
                                 {player.gamesPlayed}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "goals"
                                       ? "sorted-column"
                                       : ""
                                 }`}
                              >
                                 {player.goals}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "assists"
                                       ? "sorted-column"
                                       : ""
                                 }`}
                              >
                                 {player.assists}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "points"
                                       ? "sorted-column"
                                       : ""
                                 }`}
                              >
                                 {player.points}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "pointsPerGame"
                                       ? "sorted-column"
                                       : ""
                                 }`}
                              >
                                 {player.pointsPerGame}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "overtimeGoals"
                                       ? "sorted-column"
                                       : ""
                                 }`}
                              >
                                 {player.overtimeGoals}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "gameWinningGoals"
                                       ? "sorted-column"
                                       : ""
                                 }`}
                              >
                                 {player.gameWinningGoals}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "shots"
                                       ? "sorted-column"
                                       : ""
                                 }`}
                              >
                                 {player.shots}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortedColumn === "shootingPercentage"
                                       ? "sorted-column"
                                       : ""
                                 }`}
                              >
                                 {player.shootingPercentage}%
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               ) : (
                  <p>Loading results...</p>
               )}
            </div>
         </div>
      </div>
   );
};

export default Skaters;
