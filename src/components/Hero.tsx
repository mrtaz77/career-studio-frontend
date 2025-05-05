
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-jobathon-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Build Your <span className="text-jobathon-600">Dream Career</span> With Confidence
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Create stunning portfolios and smart CVs that get you noticed. Stand out from the crowd with Career Studio's powerful career tools.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button className="bg-jobathon-600 hover:bg-jobathon-700 text-white px-8 py-6 text-lg">
                Get Started
              </Button>
              <Button variant="outline" className="border-jobathon-600 text-jobathon-600 hover:bg-jobathon-50 px-8 py-6 text-lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-8 bg-jobathon-100 rounded-md w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-md"></div>
                  <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
                  <div className="h-32 bg-jobathon-50 rounded-md"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-accent-100 rounded-md w-1/4"></div>
                    <div className="h-8 bg-jobathon-100 rounded-md w-1/4"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent-500 w-24 h-24 rounded-full flex items-center justify-center text-white font-bold">
                <div className="text-center">
                  <div className="text-2xl">100%</div>
                  <div className="text-xs">Success</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
