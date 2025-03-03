import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchCars from './SearchCars';
import SearchQuery from './SearchQuery';
import { Container } from 'react-bootstrap';
import './Search.scss'
import { getSearchCarsPaginate } from '../../service/apiService';

const SearchPage = () => {

    const LIMIT_CAR = 5;
    const [searchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [pageCount, setPageCount] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [location, setLocation] = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [dropoffDate, setDropoffDate] = useState("");
    const navigate = useNavigate();

    // Gọi API giả lập với thông tin tìm kiếm
    const fetchCar = async (page) => {
        const response = await getSearchCarsPaginate(searchParams.get("pickupDate"), searchParams.get("dropoffDate"), searchParams.get("location"), page, LIMIT_CAR);
        const data = response.data.result;
        setPageCount(response.data.meta.pages)
        setCars(data);
    };

    const handleSearch = () => {
        console.log(pickupDate, dropoffDate, location);
        navigate(
            `/search-car?pickupDate=${encodeURIComponent(pickupDate)}&dropoffDate=${encodeURIComponent(dropoffDate)}&location=${encodeURIComponent(location)}`
        );
    };

    useEffect(() => {
        // Lấy thông tin từ query parameters
        setPickupDate(searchParams.get("pickupDate"));
        setDropoffDate(searchParams.get("dropoffDate"));
        setLocation(searchParams.get("location"));

        console.log(searchParams.get("pickupDate"));
        console.log(dropoffDate);
        console.log(location);

        fetchCar(1);
    }, [searchParams]);

    return (
        <Container className='search-page-container'>
            <SearchQuery
                pickupDate={pickupDate}
                dropoffDate={dropoffDate}
                location={location}
                setPickupDate={setPickupDate}
                setDropoffDate={setDropoffDate}
                setLocation={setLocation}
                handleSearch={handleSearch}
            />
            <SearchCars
                cars={cars}
                setCars={setCars}
                fetchCar={fetchCar}
                pageCount={pageCount}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pickupDate={pickupDate}
                dropoffDate={dropoffDate}
                location={location}
            />
        </Container>
    )
}

export default SearchPage