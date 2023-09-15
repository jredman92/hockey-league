import React, { useEffect, useState } from "react";

const Teams = ({ searchQuery }) => {
   const [jsonData, setJsonData] = useState({ teams: [] });
   const [filteredResults, setFilteredResults] = useState([]);
   const [sortColumn, setSortColumn] = useState(""); // State for the column to sort by
   const [sortDirection, setSortDirection] = useState("asc"); // State for sorting direction

   useEffect(() => {
      async function fetchData() {
         try {
            const response = await fetch("../data/teamData.json");
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
      const filtered = jsonData.teams.filter((team) =>
         team.team.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredResults(filtered);
   }, [searchQuery, jsonData.teams]);

   const sortedResultsData = getSortedResults();

   return (
      <div>
         <div className="container mx-auto px-5 py-5">
            <div className="overflow-x-auto">
               {sortedResultsData.length > 0 ? (
                  <table className="min-w-full bg-white table-bordered">
                     <colgroup className="team-colgroup">
                        <col className="team-col" />
                     </colgroup>
                     <thead>
                        <tr>
                           <th
                              className="text-left py-2 px-3 bg-gray-800 text-white"
                              title="Team"
                              onClick={() => handleSort("team")}
                           >
                              Team
                           </th>
                           <th
                              className="text-left py-2 px-3 bg-gray-800 text-white"
                              title="Games Played"
                              onClick={() => handleSort("gamesPlayed")}
                           >
                              GP
                           </th>
                           <th
                              className="text-left py-2 px-3 bg-gray-800 text-white"
                              title="Wins"
                              onClick={() => handleSort("wins")}
                           >
                              W
                           </th>
                           <th
                              className="text-left py-2 px-3 bg-gray-800 text-white"
                              title="Losses"
                              onClick={() => handleSort("losses")}
                           >
                              L
                           </th>
                           <th
                              className="text-left py-2 px-3 bg-gray-800 text-white"
                              title="Ties"
                              onClick={() => handleSort("ties")}
                           >
                              T
                           </th>
                           <th
                              className="text-left py-2 px-3 bg-gray-800 text-white"
                              title="Overtime Losses"
                              onClick={() => handleSort("overtimeLosses")}
                           >
                              OL
                           </th>
                           <th
                              className="text-left py-2 px-3 bg-gray-800 text-white"
                              title="Points"
                              onClick={() => handleSort("points")}
                           >
                              P
                           </th>
                           <th
                              className="text-left py-2 px-3 bg-gray-800 text-white"
                              title="Goals For"
                              onClick={() => handleSort("goalsFor")}
                           >
                              G/F
                           </th>
                           <th
                              className="text-left py-2 px-3 bg-gray-800 text-white"
                              title="Goals Against"
                              onClick={() => handleSort("goalsAgainst")}
                           >
                              G/A
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {getSortedResults().map((team, index) => (
                           <tr
                              key={index}
                              className={
                                 index % 2 === 0 ? "even-row" : "odd-row"
                              }
                           >
                              <td className="py-2 px-3">{team.team}</td>
                              <td className="py-2 px-3">{team.gamesPlayed}</td>
                              <td className="py-2 px-3 font-medium">
                                 {team.wins}
                              </td>
                              <td className="py-2 px-3 font-medium">
                                 {team.losses}
                              </td>
                              <td className="py-2 px-3 font-medium">
                                 {team.ties}
                              </td>
                              <td className="py-2 px-3 font-medium">
                                 {team.overtimeLosses}
                              </td>
                              <td className="py-2 px-3 font-medium">
                                 {team.points}
                              </td>
                              <td className="py-2 px-3 font-medium">
                                 {team.goalsFor}
                              </td>
                              <td className="py-2 px-3 font-medium">
                                 {team.goalsAgainst}
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

export default Teams;
