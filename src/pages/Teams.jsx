import React, { useEffect, useState } from 'react'

const Teams = ({ searchQuery }) => {
    const [jsonData, setJsonData] = useState({ values: [] })
    const [filteredResults, setFilteredResults] = useState([])
    const [sortConfig, setSortConfig] = useState({
        column: '',
        direction: 'asc',
    })

    useEffect(() => {
        const spreadsheetId = '1Nb5dze2f390lMxfwvwVcSglF3OepdH02e1gqKVn_07Y'
        const range = 'teams'
        const apiKey = 'AIzaSyC1NBWwSTURCwIdzhqTXdLpkppssRCdXJo'

        async function fetchData() {
            try {
                const response = await fetch(
                    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
                )

                if (!response.ok) {
                    throw new Error('Network response failed')
                }

                const data = await response.json()
                setJsonData(data)
            } catch (error) {
                console.error('Error retrieving data:', error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase()
        const filtered = jsonData.values.filter((row, index) =>
            index === 0 ? true : row[0].toLowerCase().includes(lowercasedQuery)
        )
        setFilteredResults(filtered.slice(1))
    }, [searchQuery, jsonData.values])

    const handleSort = (columnName) => {
        let direction = 'asc'
        if (
            sortConfig.column === columnName &&
            sortConfig.direction === 'asc'
        ) {
            direction = 'desc'
        }
        setSortConfig({ column: columnName, direction })

        const columnIndex = jsonData.values[0].indexOf(columnName)
        if (columnIndex === -1) {
            console.error(`Invalid column name: ${columnName}`)
            return
        }

        const sortedData = [...filteredResults].sort((a, b) => {
            const aValue = a[columnIndex]
            const bValue = b[columnIndex]

            if (!isNaN(aValue) && !isNaN(bValue)) {
                return direction === 'asc' ? aValue - bValue : bValue - aValue
            } else if (
                typeof aValue === 'string' &&
                typeof bValue === 'string'
            ) {
                return direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue)
            } else {
                return direction === 'asc' ? aValue - bValue : bValue - aValue
            }
        })

        setFilteredResults(sortedData)
    }

    const renderTableHeader = (column, label, hoverText) => (
        <th
            key={column}
            className={`text-left py-2 px-3 bg-gray-800 text-white ${
                sortConfig.column === column ? 'sorted' : ''
            }`}
            title={hoverText}
            onClick={() => handleSort(column)}
        >
            <div className="header-content">
                <span>{label}</span>
                {sortConfig.column === column && (
                    <span>
                        &nbsp;{sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                )}
            </div>
        </th>
    )

    const sortedResultsData = filteredResults.map((team) => ({
        team: team[0],
        gamesPlayed: team[1],
        wins: team[2],
        losses: team[3],
        ties: team[4],
        overtimeLosses: team[5],
        points: team[6],
        goalsFor: team[7],
        goalsAgainst: team[8],
    }))

    return (
        <div>
            <div className="container mx-auto px-5 py-5">
                <div className="overflow-x-auto">
                    {jsonData.values.length > 0 ? (
                        <table className="min-w-full bg-white table-bordered">
                            <colgroup className="player-colgroup">
                                <col className="player-col w-[20em]" />
                                <col className="player-col w-[10em]" />
                                <col className="player-col w-[10em]" />
                                <col className="player-col w-[10em]" />
                                <col className="player-col w-[10em]" />
                                <col className="player-col w-[10em]" />
                                <col className="player-col w-[10em]" />
                                <col className="player-col w-[10em]" />
                                <col className="team w-[10em]" />
                            </colgroup>
                            <thead>
                                <tr>
                                    {renderTableHeader('team', 'Team', 'Team')}
                                    {renderTableHeader(
                                        'gamesPlayed',
                                        'GP',
                                        'Games Played'
                                    )}
                                    {renderTableHeader('wins', 'W', 'Wins')}
                                    {renderTableHeader('losses', 'L', 'Losses')}

                                    {renderTableHeader('ties', 'T', 'Ties')}
                                    {renderTableHeader(
                                        'overtimeLosses',
                                        'O/L',
                                        'Overtime Losses'
                                    )}
                                    {renderTableHeader('points', 'P', 'Points')}
                                    {renderTableHeader(
                                        'goalsFor',
                                        'G/F',
                                        'Goals For'
                                    )}
                                    {renderTableHeader(
                                        'goalsAgainst',
                                        'G/A',
                                        'Goals Against'
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {sortedResultsData.map((team, index) => (
                                    <tr
                                        key={index}
                                        className={`${
                                            index % 2 === 0
                                                ? 'even-row'
                                                : 'odd-row'
                                        }`}
                                    >
                                        <td
                                            className={`py-2 px-3 ${
                                                sortConfig.column === 'team'
                                                    ? 'sorted-odd'
                                                    : ''
                                            }`}
                                        >
                                            {team.team}
                                        </td>

                                        <td
                                            className={`py-2 px-3 ${
                                                sortConfig.column ===
                                                'gamesPlayed'
                                                    ? 'sorted-odd'
                                                    : ''
                                            }`}
                                        >
                                            {team.gamesPlayed}
                                        </td>
                                        <td
                                            className={`py-2 px-3 ${
                                                sortConfig.column === 'wins'
                                                    ? 'sorted-column'
                                                    : ''
                                            }`}
                                        >
                                            {team.wins}
                                        </td>
                                        <td
                                            className={`py-2 px-3 ${
                                                sortConfig.column === 'losses'
                                                    ? 'sorted-column'
                                                    : ''
                                            }`}
                                        >
                                            {team.losses}
                                        </td>
                                        <td
                                            className={`py-2 px-3 ${
                                                sortConfig.column === 'ties'
                                                    ? 'sorted-column'
                                                    : ''
                                            }`}
                                        >
                                            {team.ties}
                                        </td>
                                        <td
                                            className={`py-2 px-3 ${
                                                sortConfig.column ===
                                                'overtimeLosses'
                                                    ? 'sorted-column'
                                                    : ''
                                            }`}
                                        >
                                            {team.overtimeLosses}
                                        </td>
                                        <td
                                            className={`py-2 px-3 ${
                                                sortConfig.column === 'points'
                                                    ? 'sorted-column'
                                                    : ''
                                            }`}
                                        >
                                            {team.points}
                                        </td>
                                        <td
                                            className={`py-2 px-3 ${
                                                sortConfig.column === 'goalsFor'
                                                    ? 'sorted-column'
                                                    : ''
                                            }`}
                                        >
                                            {team.goalsFor}
                                        </td>
                                        <td
                                            className={`py-2 px-3 ${
                                                sortConfig.column ===
                                                'goalsAgainst'
                                                    ? 'sorted-column'
                                                    : ''
                                            }`}
                                        >
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
    )
}

export default Teams
