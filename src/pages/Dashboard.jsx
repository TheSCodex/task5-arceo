import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "../components/Header.jsx";
import { generateUSAData } from "../generators/usaGenerator.js";
import { generateFranceData } from "../generators/franceGenerator.js";
import { generateMexicoData } from "../generators/mexicoGenerator.js";
import { generateGermanyData } from "../generators/germanyGenerator.js";
import { generateCanadaData } from "../generators/canadaGenerator.js";
import {
  generateRandomSeed,
  combineSeedAndPage,
  createRng,
} from "../utils/utils.js";
import { injectErrors } from "../utils/errorInjector.js";

function Dashboard() {
  const [region, setRegion] = useState("USA");
  const [errorRate, setErrorRate] = useState(0);
  const [seed, setSeed] = useState(generateRandomSeed());
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const dataEndRef = useRef(null);
  const prevRegion = useRef(region);
  const prevSeed = useRef(seed);

  const applyErrors = useCallback(
    (data, errorRate) => {
      const combinedSeed = combineSeedAndPage(seed, pageNumber);
      const rng = createRng(combinedSeed);

      const dataWithErrors = data.map((record) => ({
        ...record,
        name: injectErrors(record.name, errorRate, rng),
        address: injectErrors(record.address, errorRate, rng),
        phone: injectErrors(record.phone, errorRate, rng),
      }));

      return dataWithErrors;
    },
    [pageNumber, seed]
  );

  const handleGenerateData = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    const regions = {
      USA: generateUSAData,
      FR: generateFranceData,
      MX: generateMexicoData,
      GR: generateGermanyData,
      CA: generateCanadaData,
    };

    const generator = regions[region];
    const combinedSeed = combineSeedAndPage(seed, pageNumber);
    const generatedData = generator(seed, pageNumber);

    // Reset data when region or seed changes
    if (prevRegion.current !== region || prevSeed.current !== seed) {
      setOriginalData(generatedData);
      setData(applyErrors(generatedData, errorRate));
      setTotalCount(generatedData.length);
    } else {
      setOriginalData((prevOriginalData) => [
        ...prevOriginalData,
        ...generatedData,
      ]);
      setData((prevData) => [
        ...prevData,
        ...applyErrors(generatedData, errorRate),
      ]);
      setTotalCount((prevCount) => prevCount + generatedData.length);
    }

    setLoading(false);
    prevRegion.current = region;
    prevSeed.current = seed;
  }, [region, seed, pageNumber, applyErrors, errorRate, loading]);

  useEffect(() => {
    handleGenerateData();
  }, [handleGenerateData]);

  useEffect(() => {
    setPageNumber(1);
  }, [region, seed]);

  useEffect(() => {
    const handleScroll = () => {
      if (dataEndRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          setPageNumber((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pageNumber > 1) {
      handleGenerateData();
    }
  }, [pageNumber, handleGenerateData]);

  useEffect(() => {
    setData(applyErrors(originalData, errorRate));
  }, [errorRate, originalData, applyErrors]);

  const handleRegionChange = (e) => setRegion(e.target.value);
  const handleSliderChange = (e) => setErrorRate(parseFloat(e.target.value));
  const handleSeedChange = (e) => setSeed(e.target.value);
  const handleRandomSeed = () => setSeed(generateRandomSeed());

  return (
    <div ref={dataEndRef}>
      <Header />
      <div className="flex mb-4 p-4">
        <div className="flex space-x-4 mr-4">
          <label htmlFor="region-select">Select Region:</label>
          <select
            id="region-select"
            value={region}
            onChange={handleRegionChange}
            className="border rounded px-2 py-1"
          >
            <option value="USA">USA</option>
            <option value="FR">France</option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
            <option value="GR">Germany</option>
          </select>
        </div>
        <div className="flex space-x-4 mr-4">
          <label htmlFor="error-slider">Errors per Record:</label>
          <input
            id="error-slider"
            type="range"
            min="0"
            max="10"
            value={errorRate}
            onChange={handleSliderChange}
            className="slider"
          />
          <input
            type="number"
            min="0"
            max="10"
            value={errorRate}
            onChange={(e) =>
              setErrorRate(Math.min(parseFloat(e.target.value), 10))
            }
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex space-x-4">
          <label htmlFor="seed-input">Seed:</label>
          <input
            id="seed-input"
            type="number"
            value={seed}
            onChange={handleSeedChange}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={handleRandomSeed}
            className="bg-blue-500 text-white rounded px-4 py-1"
          >
            Random
          </button>
        </div>
      </div>
      <div className="p-4">
        <table className="border rounded-lg min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Index
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Identifier
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Address
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Phone number
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {totalCount > 0 ? totalCount - data.length + index + 1 : index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {item.identifier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {item.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {item.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && <div>Loading more data...</div>}
    </div>
  );
}

export default Dashboard;
