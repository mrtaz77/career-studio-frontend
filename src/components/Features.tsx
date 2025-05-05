
import { FileText, Briefcase, Edit } from 'lucide-react';

const features = [
  {
    icon: <FileText size={32} className="text-jobathon-600" />,
    title: "Smart CV Builder",
    description: "Create professional resumes with our AI-powered CV builder. Get tailored suggestions and templates that match your industry."
  },
  {
    icon: <Briefcase size={32} className="text-jobathon-600" />,
    title: "Portfolio Builder",
    description: "Showcase your best work with customizable portfolio templates. Highlight your skills and projects to impress employers."
  },
  {
    icon: <Edit size={32} className="text-jobathon-600" />,
    title: "Content Assistant",
    description: "Writer's block? Let our AI help craft compelling descriptions of your experience and achievements."
  }
];

const Features = () => {
  return (
    <div id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need To Land That Job</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Career Studio provides all the tools you need to build an impressive online presence and get noticed by employers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-jobathon-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-jobathon-50 rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to boost your career?</h3>
              <p className="text-gray-600 mb-4">
                Join thousands of job seekers who've used Career Studio to land their dream jobs. Our platform is designed to help you showcase your skills and experience in the best possible way.
              </p>
              <button className="btn-primary">Get Started Now</button>
            </div>
            <div className="md:w-1/3">
              <div className="relative">
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 transform rotate-3">
                  <div className="h-40 bg-jobathon-100 rounded-md mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded-md mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 absolute top-6 -left-4 transform -rotate-6 z-10">
                  <div className="h-40 bg-accent-100 rounded-md mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded-md mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
