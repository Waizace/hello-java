// Car Crawler JavaScript
class CarCrawler {
    constructor() {
        this.searchForm = document.getElementById('carSearchForm');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.resultsStats = document.getElementById('resultsStats');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.errorMessage = document.getElementById('errorMessage');
        this.progressFill = document.getElementById('progressFill');
        
        this.initializeEventListeners();
        this.mockCarData = this.generateMockCarData();
    }

    initializeEventListeners() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });
    }

    generateMockCarData() {
        const brands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Jeep'];
        const models = {
            'Toyota': ['RAV4', 'Highlander', '4Runner', 'Sequoia', 'Venza'],
            'Honda': ['CR-V', 'Pilot', 'Passport', 'HR-V', 'Ridgeline'],
            'Ford': ['Explorer', 'Escape', 'Expedition', 'Edge', 'Bronco'],
            'Chevrolet': ['Tahoe', 'Suburban', 'Traverse', 'Equinox', 'Blazer'],
            'Nissan': ['Rogue', 'Pathfinder', 'Armada', 'Murano', 'Kicks'],
            'Hyundai': ['Tucson', 'Santa Fe', 'Palisade', 'Venue', 'Nexo'],
            'Kia': ['Sorento', 'Sportage', 'Telluride', 'Seltos', 'Niro'],
            'Mazda': ['CX-5', 'CX-9', 'CX-30', 'CX-50', 'MX-30'],
            'Subaru': ['Outback', 'Forester', 'Ascent', 'Crosstrek', 'Wilderness'],
            'Jeep': ['Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Wrangler']
        };
        
        const suvTypes = {
            'compact': ['CR-V', 'RAV4', 'Escape', 'Equinox', 'Rogue', 'Tucson', 'Sportage', 'CX-5', 'Forester', 'Cherokee'],
            'midsize': ['Pilot', 'Highlander', 'Explorer', 'Traverse', 'Pathfinder', 'Santa Fe', 'Sorento', 'CX-9', 'Outback', 'Grand Cherokee'],
            'fullsize': ['Sequoia', 'Expedition', 'Tahoe', 'Suburban', 'Armada', 'Palisade', 'Telluride', 'Ascent'],
            'luxury': ['Lexus GX', 'Acura MDX', 'Lincoln Navigator', 'Cadillac Escalade', 'Infiniti QX80'],
            'crossover': ['Venza', 'HR-V', 'Edge', 'Blazer', 'Murano', 'Venue', 'Seltos', 'CX-30', 'Crosstrek', 'Compass']
        };

        const sources = ['AutoTrader', 'Cars.com', 'CarGurus', 'CarMax', 'Carvana', 'Vroom', 'CarsDirect', 'TrueCar'];
        
        const cars = [];
        
        // Generate 200 mock cars
        for (let i = 0; i < 200; i++) {
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const modelList = models[brand];
            const model = modelList[Math.floor(Math.random() * modelList.length)];
            
            const year = 2015 + Math.floor(Math.random() * 10); // 2015-2024
            const mileage = Math.floor(Math.random() * 120000) + 5000; // 5k-125k miles
            const basePrice = 15000 + Math.floor(Math.random() * 50000); // $15k-$65k
            const price = Math.floor(basePrice / 1000) * 1000; // Round to nearest thousand
            
            // Determine SUV type based on model
            let suvType = 'compact';
            for (const [type, typeModels] of Object.entries(suvTypes)) {
                if (typeModels.some(m => model.includes(m.split(' ')[0]))) {
                    suvType = type;
                    break;
                }
            }
            
            const source = sources[Math.floor(Math.random() * sources.length)];
            
            cars.push({
                id: i + 1,
                brand,
                model,
                year,
                price,
                mileage,
                suvType,
                source,
                title: `${year} ${brand} ${model}`,
                features: this.generateRandomFeatures(),
                location: this.generateRandomLocation(),
                condition: Math.random() > 0.1 ? 'Good' : 'Fair'
            });
        }
        
        return cars;
    }

    generateRandomFeatures() {
        const allFeatures = [
            'AWD', '4WD', 'Leather Seats', 'Sunroof', 'Navigation', 'Backup Camera',
            'Heated Seats', 'Bluetooth', 'Third Row', 'Premium Audio', 'Keyless Entry',
            'Remote Start', 'Tow Package', 'Roof Rails', 'Power Liftgate'
        ];
        
        const numFeatures = Math.floor(Math.random() * 6) + 3; // 3-8 features
        const features = [];
        
        for (let i = 0; i < numFeatures; i++) {
            const feature = allFeatures[Math.floor(Math.random() * allFeatures.length)];
            if (!features.includes(feature)) {
                features.push(feature);
            }
        }
        
        return features;
    }

    generateRandomLocation() {
        const cities = [
            'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
            'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
            'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC'
        ];
        
        return cities[Math.floor(Math.random() * cities.length)];
    }

    async performSearch() {
        const formData = new FormData(this.searchForm);
        const searchCriteria = {
            maxPrice: parseInt(formData.get('maxPrice')),
            suvType: formData.get('suvType'),
            minYear: parseInt(formData.get('minYear')),
            maxMileage: parseInt(formData.get('maxMileage'))
        };

        // Validate inputs
        if (!this.validateSearchCriteria(searchCriteria)) {
            return;
        }

        this.showLoading();
        this.hideResults();
        this.hideError();

        try {
            // Simulate crawling multiple websites
            const results = await this.crawlWebsites(searchCriteria);
            this.displayResults(results, searchCriteria);
        } catch (error) {
            this.showError('An error occurred while searching for cars. Please try again.');
            console.error('Search error:', error);
        } finally {
            this.hideLoading();
        }
    }

    validateSearchCriteria(criteria) {
        if (criteria.maxPrice <= 0) {
            this.showError('Please enter a valid maximum price.');
            return false;
        }
        
        if (criteria.minYear < 1990 || criteria.minYear > 2024) {
            this.showError('Please enter a valid year between 1990 and 2024.');
            return false;
        }
        
        if (criteria.maxMileage < 0) {
            this.showError('Please enter a valid maximum mileage.');
            return false;
        }
        
        return true;
    }

    async crawlWebsites(criteria) {
        const websites = ['AutoTrader', 'Cars.com', 'CarGurus', 'CarMax', 'Carvana'];
        let allResults = [];
        
        for (let i = 0; i < websites.length; i++) {
            // Update progress
            const progress = ((i + 1) / websites.length) * 100;
            this.updateProgress(progress);
            
            // Simulate network delay
            await this.delay(800 + Math.random() * 400);
            
            // Filter cars based on criteria
            const siteResults = this.mockCarData.filter(car => {
                const matchesPrice = car.price <= criteria.maxPrice;
                const matchesYear = car.year >= criteria.minYear;
                const matchesMileage = car.mileage <= criteria.maxMileage;
                const matchesType = criteria.suvType === 'any' || car.suvType === criteria.suvType;
                
                return matchesPrice && matchesYear && matchesMileage && matchesType;
            });
            
            // Simulate different results from different sites
            const shuffled = siteResults.sort(() => 0.5 - Math.random());
            const siteSpecificResults = shuffled.slice(0, Math.floor(Math.random() * 15) + 5);
            
            allResults = allResults.concat(siteSpecificResults);
        }
        
        // Remove duplicates and sort by price
        const uniqueResults = allResults.filter((car, index, self) => 
            index === self.findIndex(c => c.id === car.id)
        );
        
        return uniqueResults.sort((a, b) => a.price - b.price);
    }

    displayResults(results, criteria) {
        this.resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            this.resultsStats.innerHTML = `
                <p><strong>No cars found</strong> matching your criteria. Try adjusting your search parameters.</p>
            `;
            this.showResults();
            return;
        }

        // Display stats
        const avgPrice = Math.round(results.reduce((sum, car) => sum + car.price, 0) / results.length);
        const avgMileage = Math.round(results.reduce((sum, car) => sum + car.mileage, 0) / results.length);
        
        this.resultsStats.innerHTML = `
            <p><strong>${results.length} cars found</strong> | Average Price: <strong>$${avgPrice.toLocaleString()}</strong> | Average Mileage: <strong>${avgMileage.toLocaleString()} miles</strong></p>
        `;

        // Display car cards
        results.forEach(car => {
            const carCard = this.createCarCard(car);
            this.resultsContainer.appendChild(carCard);
        });

        this.showResults();
    }

    createCarCard(car) {
        const card = document.createElement('div');
        card.className = 'car-card';
        
        const featuresHtml = car.features.slice(0, 4).map(feature => 
            `<span class="feature-tag">${feature}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="car-title">${car.title}</div>
            <div class="car-price">$${car.price.toLocaleString()}</div>
            <div class="car-details">
                <div class="car-detail">
                    <strong>Year:</strong> ${car.year}
                </div>
                <div class="car-detail">
                    <strong>Mileage:</strong> ${car.mileage.toLocaleString()} mi
                </div>
                <div class="car-detail">
                    <strong>Type:</strong> ${car.suvType.charAt(0).toUpperCase() + car.suvType.slice(1)} SUV
                </div>
                <div class="car-detail">
                    <strong>Condition:</strong> ${car.condition}
                </div>
            </div>
            <div class="car-features" style="margin: 10px 0; font-size: 0.8rem;">
                ${featuresHtml}
            </div>
            <div class="car-location" style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">
                📍 ${car.location}
            </div>
            <div class="car-source">Found on ${car.source}</div>
        `;
        
        // Add click handler to simulate opening car details
        card.addEventListener('click', () => {
            this.showCarDetails(car);
        });
        
        return card;
    }

    showCarDetails(car) {
        alert(`Car Details:\n\n${car.title}\nPrice: $${car.price.toLocaleString()}\nMileage: ${car.mileage.toLocaleString()} miles\nFeatures: ${car.features.join(', ')}\nLocation: ${car.location}\nSource: ${car.source}\n\nIn a real application, this would open a detailed view or redirect to the source website.`);
    }

    showLoading() {
        this.loadingIndicator.style.display = 'flex';
        this.updateProgress(0);
    }

    hideLoading() {
        this.loadingIndicator.style.display = 'none';
    }

    showResults() {
        this.resultsSection.style.display = 'block';
    }

    hideResults() {
        this.resultsSection.style.display = 'none';
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }

    updateProgress(percentage) {
        this.progressFill.style.width = `${percentage}%`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global function to hide error (called from HTML)
function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Initialize the crawler when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CarCrawler();
});

// Add some additional CSS for feature tags
const additionalStyles = `
    .feature-tag {
        display: inline-block;
        background: #e2e8f0;
        color: #4a5568;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
        margin: 2px;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);