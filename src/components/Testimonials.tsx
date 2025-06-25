const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Manager',
    company: 'TechCorp',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    quote:
      'Career Studio helped me create a stunning portfolio that showcased my skills perfectly. I had three interview offers within a week!',
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    company: 'InnovateSoft',
    image: 'https://randomuser.me/api/portraits/men/46.jpg',
    quote:
      'The Smart CV builder made it so easy to highlight my technical experience. The templates are professional and modern.',
  },
  {
    name: 'Lisa Rodriguez',
    role: 'Graphic Designer',
    company: 'CreativeStudio',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    quote:
      'As a creative professional, I needed a portfolio that would let my work shine. Career Studio delivered exactly what I needed.',
  },
];

const Testimonials = () => {
  return (
    <div id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#6254a9] mb-4">What Our Users Say</h2>
          <p className="text-[#7764a0] max-w-2xl mx-auto">
            Thousands of job seekers have used Career Studio to advance their careers. Here is what
            some of them have to say.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold text-[#6254a9]">{testimonial.name}</h4>
                  <p className="text-sm text-[#7764a0]">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="mb-4 text-[#6254a9]">★★★★★</div>
              <p className="text-[#7764a0] italic">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
