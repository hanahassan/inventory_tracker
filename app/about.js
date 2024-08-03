import { Box, Typography } from "@mui/material";
import NavBar from './NavBar';

export default function About() {
  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" bgcolor="#090b24" color="#bfbfbf">
      <NavBar />
      <Box width="1000px" mt={8} p={5} bgcolor="#13162e" borderRadius="8px" boxShadow={3}>
        <Typography variant="h3" mb={4}>About This Project</Typography>
        <Typography variant="body1" mb={2}>
          My name is Hana Hassan, and I built this pantry management application using Next.js, Material UI, and Firebase. This project involved developing a clean and clear CRUD application to manage inventory for a manufacturing system.
        </Typography>
        <Typography variant="body1" mb={2}>
          Here are some key features and skills I developed during this project:
        </Typography>
        <Typography variant="body1" component="ul" mb={2}>
          <li>Developed a user-friendly CRUD application for managing inventory.</li>
          <li>Deployed the application on Vercel for easy access and scalability.</li>
          <li>Integrated image recognition capabilities using the <a href="https://www.npmjs.com/package/react-camera-pro" target="_blank" rel="noopener noreferrer">react-camera-pro</a> npm package.</li>
          <li>Utilized computer vision APIs such as OpenAI Vision Model and Gemini for classifying images and updating the inventory in real-time.</li>
        </Typography>
        <Typography variant="body1" mb={2}>
          The image recognition feature allows users to take a picture with their phone, classify the image using a large language model or API, and update the CRUD application accordingly. This process involved:
        </Typography>
        <Typography variant="body1" component="ul">
          <li>Taking an image from a live URL using an npm package that connects to the camera.</li>
          <li>Connecting to a computer vision API to recognize the content of the image.</li>
          <li>Classifying the recognized content as text and updating the inventory database.</li>
        </Typography>
        <Typography variant="body1" mt={4}>
          This project helped me enhance my skills in web development, image recognition, and the integration of various technologies to build a functional and user-friendly application.
        </Typography>
      </Box>
    </Box>
  );
}
