import React, { useEffect, useState } from "react";

const Goalies = ({ searchQuery }) => {
   const [jsonData, setJsonData] = useState({ values: [] });
   const [filteredResults, setFilteredResults] = useState([]);
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "asc",
   });

   useEffect(() => {
      const spreadsheetId = "1Nb5dze2f390lMxfwvwVcSglF3OepdH02e1gqKVn_07Y";
      const range = "goalies";
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
      catches: player[2],
      gamesPlayed: player[3],
      wins: player[4],
      losses: player[5],
      shotsAgainst: player[6],
      saves: player[7],
      goalsAgainst: player[8],
      shutouts: player[9],
   }));

   return (
      <div>
         <div className="container mx-auto px-5 py-5">
            <div className="overflow-x-auto">
               {jsonData.values.length > 0 ? (
                  <table className="min-w-full bg-white table-bordered">
                     <colgroup className="player-colgroup">
                        <col className="player-col w-2/12" />
                        <col className="player-col w-2/12" />
                        <col className="player-col w-1/12" />
                        <col className="player-col w-1/12" />
                        <col className="player-col w-1/12" />
                        <col className="player-col w-1/12" />
                        <col className="player-col w-1/12" />
                        <col className="player-col w-1/12" />
                        <col className="player-col w-1/12" />
                        <col className="player-col w-1/12" />
                     </colgroup>
                     <thead>
                        <tr>
                           {renderTableHeader("player", "Player", "Player")}
                           {renderTableHeader("team", "Team", "Team")}
                           {renderTableHeader("catches", "C", "catches")}
                           {renderTableHeader("gamesPlayed", "GP", "Games Played")}
                           {renderTableHeader("wins", "W", "Wins")}
                           {renderTableHeader("losses", "L", "Losses")}
                           {renderTableHeader("shotsAgainst", "SA", "Shots Against")}
                           {renderTableHeader("saves", "S", "Saves")}
                           {renderTableHeader("goalsAgainst", "GA", "Goals Against")}
                           {renderTableHeader("shutouts", "S/O", "Shutouts")}
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
                              <td className={`py-2 px-3 ${sortConfig.column === "catches" ? "sorted-odd" : ""}`}>
                                 {player.catches}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "gamesPlayed" ? "sorted-column" : ""}`}>
                                 {player.gamesPlayed}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "wins" ? "sorted-column" : ""}`}>
                                 {player.wins}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "losses" ? "sorted-column" : ""}`}>
                                 {player.losses}
                              </td>
                              <td
                                 className={`py-2 px-3 ${sortConfig.column === "shotsAgainst" ? "sorted-column" : ""}`}
                              >
                                 {player.shotsAgainst}
                              </td>

                              <td className={`py-2 px-3 ${sortConfig.column === "saves" ? "sorted-column" : ""}`}>
                                 {player.saves}
                              </td>
                              <td
                                 className={`py-2 px-3 ${sortConfig.column === "goalsAgainst" ? "sorted-column" : ""}`}
                              >
                                 {player.goalsAgainst}
                              </td>
                              <td className={`py-2 px-3 ${sortConfig.column === "shutouts" ? "sorted-column" : ""}`}>
                                 {player.shutouts}
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

export default Goalies;
