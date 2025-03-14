const formPost = (name, phone, email, address, city, surface, description) => `https://docs.google.com/forms/d/e/1FAIpQLSdILumHMko-lSeuVBsie0QfrIgG3bPdL_RSTtOuPIvePRQq_Q/formResponse?&submit=Submit?usp=pp_url&entry.823424043=${name}&entry.1730545173=${phone}&entry.1955899792=${email}&entry.518836365=${address}&entry.1620806425=${city}&entry.779264635=${surface}&entry.1140661047=${description}`

const getRequest = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
    });
    return { error: null, response };
  } catch (error) {
    return { error };
  }
}

document.addEventListener('alpine:init', () => {
  Alpine.data('contactForm', () => ({ 
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    surface: '',
    description: '',
    maxChars: 200,
    errors: {},
    open: false,
    validateForm() {
      this.errors = {};

      if (!this.firstName) this.errors.firstName = 'First name is required';
      if (!this.lastName) this.errors.lastName = 'Last name is required';
      if (!this.email) this.errors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(this.email)) this.errors.email = 'Email is invalid';
      if (!this.phone) this.errors.phone = 'Phone number is required';
      if (!this.address) this.errors.address = 'Street address is required';
      if (!this.city) this.errors.city = 'City is required';
      if (!this.surface) this.errors.surface = 'Surface is required';
      if (this.description.length > this.maxChars) this.errors.description = 'Description is too long';

      if (Object.keys(this.errors).length === 0) {
        const URL = formPost(this.firstName + ' ' + this.lastName, this.phone, this.email, this.address, this.city, this.surface, this.description);
        getRequest(URL)
          .then(({ error }) => {
            if (error) {
              console.error('Error:', error);
              alert('An error occurred, please try again later');
            } else {
              alert('Form submitted successfully');
              this.firstName = '';
              this.lastName = '';
              this.email = '';
              this.phone = '';
              this.address = '';
              this.city = '';
              this.surface = '';
              this.description = '';
            }

            this.open = false;
          });
      }
    },
    get remainingChars() {
      return `( Only ${this.maxChars - this.description.length} characters left )`;
    }
  }));
})
