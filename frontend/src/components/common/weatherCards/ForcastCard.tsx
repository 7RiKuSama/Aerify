import { StatLabel, Text, StatHelpText, Icon, HStack, Box } from "@chakra-ui/react";
import React from "react";

interface ForcastCardProps {
    label: string | null;
    value: string | null;
    unit: string | null;
    children: React.ReactNode;
}

const ForcastCard: React.FC<ForcastCardProps> = ({ label, value, unit, children }) => {
    return (
        <Box h="100%" borderWidth="1px" borderColor="gray" borderRadius="5px" p={2} width="100%">
            <HStack justifyContent="space-between" alignItems="center">
                <StatLabel>{label}</StatLabel>
                <Icon color="fg.muted" fontSize="15px">
                    {children}
                </Icon>
            </HStack>
            <Text fontSize={{ base: "14px", sm: "25px" }} fontWeight="bold">
                {value}
                <StatHelpText>{unit}</StatHelpText>
            </Text>
        </Box>
    );
};

export default ForcastCard;





