// SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "skill-wallet/contracts/main/partnersAgreement/interfaces/IPartnersAgreement.sol";
import "skill-wallet/contracts/main/partnersAgreement/interfaces/IActivities.sol";
import "skill-wallet/contracts/main/partnersAgreement/contracts/Interaction.sol";
import "skill-wallet/contracts/main/community/ICommunity.sol";
import "skill-wallet/contracts/main/ISkillWallet.sol";
import "skill-wallet/contracts/main/utils/RoleUtils.sol";

contract DAOReward is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    IPartnersAgreement public partnersAgreement;
    ICommunity public community;
    ISkillWallet public skillWallet;

    uint256 public supplyToBeMinted;
    uint256 public minimumInteractions;

    constructor(
        address _partnersAgreementAddr,
        uint256 _minimumInteractions,
        uint256 supply
    ) public ERC1155("https://super.decentralized.storage") {

        partnersAgreement = IPartnersAgreement(_partnersAgreementAddr);
        community = ICommunity(
            IPartnersAgreement(_partnersAgreementAddr).communityAddress()
        );
        minimumInteractions = _minimumInteractions;
        skillWallet = ISkillWallet(
            ICommunity(community).getSkillWalletAddress()
        );

        supplyToBeMinted = supply;
    }

    // claim your badge
    function claim() public {
        require(checkNewBadges(), "no badges to mint!");

        uint256 role = uint256(skillWallet.getRole(msg.sender));
        _mint(msg.sender, role, 1, "");
        supplyToBeMinted--;
    }

    // check if you have new badges to mint
    function checkNewBadges() public view returns (bool) {
        IActivities activities = IActivities(
            partnersAgreement.getActivitiesAddress()
        );
        uint256 role = uint256(skillWallet.getRole(msg.sender));

        Interaction interaction = Interaction(activities.getInteractionsAddr());
        return
            balanceOf(msg.sender, role) == 0 &&
            interaction.getInteractionsIndexPerAddress(msg.sender) >= 10;
    }
}
