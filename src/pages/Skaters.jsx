import React, { useEffect, useState } from "react";

const Skaters = ({ searchQuery }) => {
   const [jsonData, setJsonData] = useState({ values: [] });
   const [filteredResults, setFilteredResults] = useState([]);
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "asc",
   });

   useEffect(() => {
      const spreadsheetId = "1Nb5dze2f390lMxfwvwVcSglF3OepdH02e1gqKVn_07Y";
      const range = "skaters";
      const apiKey = "AIzaSyC1NBWwSTURCwIdzhqTXdLpkppssRCdXJo";

      async function fetchData() {
         try {
            const response = await fetch(
               `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
            );

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

   useEffect(() => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = jsonData.values.filter((row, index) =>
         index === 0 ? true : row[0].toLowerCase().includes(lowercasedQuery)
      );
      setFilteredResults(filtered.slice(1));
   }, [searchQuery, jsonData.values]);

   const handleSort = (columnName) => {
      let direction = "asc";
      if (sortConfig.column === columnName && sortConfig.direction === "asc") {
         direction = "desc";
      }
      setSortConfig({ column: columnName, direction });

      const columnIndex = jsonData.values[0].indexOf(columnName);
      if (columnIndex === -1) {
         console.error(`Invalid column name: ${columnName}`);
         return;
      }

      const sortedData = [...filteredResults].sort((a, b) => {
         const aValue = a[columnIndex];
         const bValue = b[columnIndex];

         if (!isNaN(aValue) && !isNaN(bValue)) {
            return direction === "asc" ? aValue - bValue : bValue - aValue;
         } else if (typeof aValue === "string" && typeof bValue === "string") {
            return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
         } else {
            return direction === "asc" ? aValue - bValue : bValue - aValue;
         }
      });

      setFilteredResults(sortedData);
   };

   const renderTableHeader = (column, label, hoverText) => (
      <th
         key={column}
         className={`text-left py-2 px-3 bg-gray-800 text-white ${sortConfig.column === column ? "sorted" : ""}`}
         title={hoverText}
         onClick={() => handleSort(column)}
      >
         <div className="header-content">
            <span>{label}</span>
            {sortConfig.column === column && <span>&nbsp;{sortConfig.direction === "asc" ? "▲" : "▼"}</span>}
         </div>
      </th>
   );

   const sortedResultsData = filteredResults.map((player) => ({
      player: player[0],
      team: player[1],
      position: player[2],
      gamesPlayed: player[3],
      goals: player[4],
      assists: player[5],
      points: player[6],
      pointsPerGame: player[7],
      overtimeGoals: player[8],
      gameWinningGoals: player[9],
      shots: player[10],
      shootingPercentage: player[11],
   }));

   return (
      <div>
         <div className="container mx-auto px-5 py-5">
            <div className="overflow-x-auto">
               {jsonData.values.length > 0 ? (
                  <table className="min-w-full bg-white table-bordered">
                     <colgroup className="player-colgroup">
                        <col className="player-col w-[20em]" />
                        <col className="player-col w-[20em]" />
                        <col className="player-col w-[10em]" />
                        <col className="player-col w-[10em]" />
                        <col className="player-col w-[10em]" />
                        <col className="player-col w-[10em]" />
                        <col className="player-col w-[10em]" />
                        <col className="player-col w-[10em]" />
                        <col className="player-col w-[10em]" />
                        <col className="player-col w-[10em]" />
                        <col className="player-col w-[10em]" />
                        <col className="player-col w-[10em]" />
                     </colgroup>
                     <thead>
                        <tr>
                           {renderTableHeader("player", "Player", "Player")}
                           {renderTableHeader("team", "Team", "Team")}
                           {renderTableHeader("position", "Pos", "Position")}
                           {renderTableHeader("gamesPlayed", "GP", "Games Played")}
                           {renderTableHeader("goals", "G", "Goals")}
                           {renderTableHeader("assists", "A", "Assists")}
                           {renderTableHeader("points", "P", "Points")}
                           {renderTableHeader("pointsPerGame", "P/G", "Points Per Game")}
                           {renderTableHeader("overtimeGoals", "OTG", "Overtime Goals")}
                           {renderTableHeader("gameWinningGoals", "GWG", "Game Winning Goals")}
                           {renderTableHeader("shots", "S", "Shots")}
                           {renderTableHeader("shootingPercentage", "S%", "Shooting Percentage")}
                        </tr>
                     </thead>

                     <tbody>
                        {sortedResultsData.map((player, index) => (
                           <tr
                              key={index}
                              className={`${index % 2 === 0 ? "even-row" : "odd-row"}`}
                           >
                              <td className={`py-2 px-3 ${sortConfig.column === "player" ? "sorted-odd" : ""}`}>
                                 {player.player}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "team" ? "sorted-even" : ""}`}>
                                 {player.team}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "position" ? "sorted-odd" : ""}`}>
                                 {player.position}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "gamesPlayed" ? "sorted-column" : ""}`}>
                                 {player.gamesPlayed}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "goals" ? "sorted-column" : ""}`}>
                                 {player.goals}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "assists" ? "sorted-column" : ""}`}>
                                 {player.assists}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "points" ? "sorted-column" : ""}`}>
                                 {player.points}
                              </td>
                              <td
                                 className={`py-2 px-3 ${sortConfig.column === "pointsPerGame" ? "sorted-column" : ""}`}
                              >
                                 {player.pointsPerGame}
                              </td>
                              <td
                                 className={`py-2 px-3 ${sortConfig.column === "overtimeGoals" ? "sorted-column" : ""}`}
                              >
                                 {player.overtimeGoals}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortConfig.column === "gameWinningGoals" ? "sorted-column" : ""
                                 }`}
                              >
                                 {player.gameWinningGoals}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "shots" ? "sorted-column" : ""}`}>
                                 {player.shots}
                              </td>
                              <td
                                 className={`py-2 px-3 ${
                                    sortConfig.column === "shootingPercentage" ? "sorted-column" : ""
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
