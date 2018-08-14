
<!DOCTYPE html>
<meta charset="utf-8">
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://rawgit.com/susielu/d3-legend/master/d3-legend.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<link rel="stylesheet" href="https://bootswatch.com/4/pulse/bootstrap.min.css">
<link rel="stylesheet" href="custom.css">

<body>
  <div class="container-fluid">
    <br>
    <div class="jumbotron">
      <h2 class="display-4">All One People and Under One King</h2>
      <h3><a href="https://maevekane.net">Maeve Kane</a>, University at Albany SUNY | <a href="twitter.com/maevekane">@MaeveKane</a></h3> 
    </div>
    
    <div id="navigation">
      <div id="filters">
        <div class="form-group form-row">
          <div class="col-1"><label for="filter-fill"><strong>Color individuals by:</strong></label></div>
          <div class="col">
            <select id="filter-fill" class="form-control">
              <option selected value="race">Race</option>
              <option value="gender">Gender</option>
              <option value="clan">Clan</option>
              <option value="modularity_class">Subcommunity</option>
              <option value="role">Role</option>
            </select>
          </div>
          
          <div class="col-1"><label for="filter-stroke"><strong>Color individual outlines by:</strong></label></div>
          <div class="col">
            <select id="filter-stroke" class="form-control">
              <option selected value="race">Race</option>
              <option value="gender">Gender</option>
              <option value="clan">Clan</option>
              <option value="modularity_class">Subcommunity</option>
              <option value="role">Role</option>
            </select>
          </div>
          
          <div class="col-1"><label for="node-size"><strong>Size individuals by:</strong></label></div>
          <div class="col">
            <select id="node-size" class="form-control">
              <option selected value="betweenness">Network influence</option>
              <option value="degree">Number of connections</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
        <label for="selected-year">Year: </label><input type="range" name="year" class="slider form-control" id="selected-year" value="1733" min="1733" max="1746" >
        <span class="slider_label h5"></span>
        </div>
      </div>
      
      <div class="row">
        <div class="col-sm-8 ml-3 mr-2 p-0" id="viz"></div>
        <div class="col ml-2 mr-3 py-2" id="text">
          <h4>Introduction</h4>
          <p>The 1711 construction of Queen Anne’s Chapel in Fort Hunter was intended to serve many goals for the Iroquois and New York colonial leaders who requested it, the British metropolitan officials who funded it, and the Iroquois and settler congregants who attended it.  Peter Schuyler, mayor of Albany, and the 'Four Indian Kings' (actually three young Mohawks and a Mahican without real authority) traveled to London in 1710 to more firmly tie British imperial interests to the defense of New York and Native communities against French <a aria-describedby="footnote-label" href="#incursion">incursion.</a>  Queen Anne funded the construction of a fort and a chapel within its walls, hoping to build on previously spotty Dutch and Anglican conversion efforts among the Mohawk and prevent further Catholic conversions by French <a aria-describedby="footnote-label" href="#jesuits">Jesuits.</a>  For the Anglican Mohawks at Tionondoroge and the nearby Dutch, English, Scots, Irish and Palatine German settlers and enslaved Africans who attended service and baptized their children at Queen Anne’s Chapel, the spiritual community both bound their entangled communities together and reinforced ethnic and racial distinctions within this mixed congregation.</p>
        <figure class="figure">
          <img src="map.png" class="figure-img img-fluid rounded">
          <figcaption class="figure-caption">The Six Nations and nearby settler colonies, circa 1735.  Map by the author, after Jordan 2008: 5.</figcaption>
        </figure>
        <p>The communities surrounding Fort Hunter which attended service and baptized their children at Queen Anne’s Chapel were mixed and varied.  The Mohawk community of Tionondoroge, where most of the Iroquois Fort Hunter congregants lived, had a long history of mixed material culture in which European goods were used and reworked to fit indigenous contexts, as well as a hybrid practice of Christianity which blended indigenous, Catholic, and Protestant <a aria-describedby="footnote-label" href="#elements">elements.</a>  As a result of a long-disputed land purchase, Dutch and English residents of Albany settled near Fort Hunter and brought enslaved Africans with <a aria-describedby="footnote-label" href="#them">them.</a> In addition to these groups, in 1710 New York governor Robert Hunter sponsored the settlement of thousands of Palatine German refugees in the pine barrens of the Mohawk and Hudson Valleys in a scheme to make naval stores for the Royal Navy and provide refuge for Protestants displaced by war in <a aria-describedby="footnote-label" href="#europe">Europe.</a>  When the pitch scheme turned sour, delegations of Palatines established friendly relations with Schoharie Valley Mohawks and settled instead on fertile farmland along Schoharie Creek, angering Dutch and English elites in Albany and Governor Hunter, all of whom had begun speculating on the land along Schoharie Creek despite Mohawk <a aria-describedby="footnote-label" href="#objections">objections.</a>  By 1753, the Palatines and Schoharie Valley Mohawks petitioned the New York governor together to make an allowance for the Palatines to remain on the land they had settled, “for we are on[e] church and we will not part.  We are grown up together and we intend to live our lifetime together as <a aria-describedby="footnote-label" href="#brothers">Brothers.”</a>  After 1718, Ulster Scots and Protestant Irish filtered into the area as well, including William Johnson, who arrived in 1738 to administer land his uncle had bought in the area.6  In addition, some Mahicans moved into the area seeking agricultural work with European landowners or as indentured servants.7  In this mixed landscape, people from two Native nations with very different relations to colonialism, European ethnic groups at odds with one another, and enslaved Africans all attended church and had their children baptized at Queen Anne's Chapel.  The network of relations documented by these baptisms made visible the ways in which ethnic and racial boundaries were made, maintained, and occasionally crossed.</p>
        <figure class="figure">
          <img src="map.png" class="figure-img img-fluid rounded">
          <figcaption class="figure-caption">The Mohawk and Schoharie Vallies, circa 1735.  Map by the author.</figcaption>
        </figure>
        </div>
      
      </div>
    </div>
  <div class="row"><div class="col">
    </br>
    <h6 class="text-muted">Presented for the William and Mary Quarterly Digital Research in Early America Forum at University of California Irvine, October 11-12 2018. Special thanks to Nick Schiraldi of UAlbany’s Academic and Research Computing Center.</h6>
    <hr>
    <footnotes>
    <ol>
      <li id="incursion">Daniel K Richter, “Cultural Brokers and Intercultural Politics: New York-Iroquois Relations, 1664-1701,” The Journal of American History 75, no. 1 (1988): 40–67; Daniel K. Richter, “Some of Them . . . Would Always Have a Minister with Them: Mohawk Protestantism 1683-1791,” American Indian Quarterly 16, no. 4 (Autumn 1992): 471–84. Daniel K. Richter, The Ordeal of the Longhouse: The Peoples of the Iroquois League in the Era of European Colonization (Chapel Hill: Published for the Institute of Early American History and Culture, Williamsburg, Virginia, by the University of North Carolina Press, 1992); David Preston, The Texture of Contact : European and Indian Settler Communities on the Frontiers of Iroquoia, 1667-1783 (Lincoln: University of Nebraska Press, 2009); Gail D MacLeitch, Imperial Entanglements: Iroquois Change and Persistence on the Frontiers of Empire (Philadelphia: University of Pennsylvania Press, 2011); Edward Countryman, “Toward a Different Iroquois History,” ed. Jon Parmenter et al., The William and Mary Quarterly 69, no. 2 (2012): 347–60, https://doi.org/10.5309/willmaryquar.69.2.0347; Daniel R. Mandell, “‘Turned Their Minds to Religion’: Oquaga and the First Iroquois Church, 1748-1776,” Early American Studies: An Interdisciplinary Journal 11, no. 2 (2013): 211–42, https://doi.org/10.1353/eam.2013.0017. <a href="#text" aria-label="Back to content">↵</a></li>
      <li id="jesuits">See for example Daniel Richter, “Cultural Brokers and Intercultural Politics: New York-Iroquois Relations.” The Journal of American History. June 1988, Vol 75: 41; James Hart Merrell, Into the American Woods : Negotiators on the Pennsylvania Frontier. New York: Norton, 1999; Richard White,  The Middle Ground : Indians, Empires, and Republics in the Great Lakes Region, 1650-1815.  New York: Cambridge University Press, 1991; Margaret Szasz, editor.  Between Indian and White Worlds: The Cultural Broker.  Norman OK: University of Oklahoma Press.  1994; Robert Grumet, editor. Northeastern Indian Lives, 1632-1816. Amherst: University of Massachusetts Press.  1996; Nancy Hagedorn, “Brokers of Understanding: Interpreters as Agents of Cultural Exchange in Colonial New York.” New York History. Fall 1995, Vol 76: 379-408; Laura Johnson, “Goods to Clothe Themselves.” Winterthur Portfolio 43, no. 1 (2009); Timothy J Shannon, Indians and Colonists at the Crossroads of Empire : The Albany Congress of 1754. Ithaca, N.Y: Cornell University Press ; New York State Historical Association, 2000; Peter C. Mancall, and James Hart Merrell. American Encounters : Natives and Newcomers from European Contact to Indian Removal, 1500-1850. New York: Routledge, 2000; Jane T. Merritt, At the Crossroads : Indians and Empires on a Mid-Atlantic Frontier, 1700-1763. Omohundro Institute of Early American History & Culture. Chapel Hill: University of North Carolina Press, 2003;  Timothy J. Shannon, “Dressing for Success on the Mohawk Frontier: Hendrick, William Johnson, and the Indian Fashion.” The William and Mary Quarterly 53, no. 1 (1996): 13–42; Nancy Hagedorn, “Brokers of Understanding: Interpreters as Agents of Cultural Exchange in Colonial New York,” New York History 76, no. 4 (1995): 379–408.  For a critique of this focus on the male diplomatic encounter, see Ann M. Little, "Gender and Sexuality in the North American Borderlands, 1492–1848." History Compass 7, no. 6 (2009): 1606-1615.<a href="#text" aria-label="Back to content">↵</a></li>
      <li id="elements">Susan Sleeper-Smith,  Indian women and French men: rethinking cultural encounter in the Western Great Lakes. University of Massachusetts Press, 2001; Michele Mitchell, "Turns of the Kaleidoscope: Race, Ethnicity, and Analytical Patterns in American Women's and Gender History." Journal of Women's History  25:4 (2013): 46-73; Morrissey, "Kaskaskia Social Network.”  For an examination of the importance of nation, ethnicity, and indigenous political power to Native women's intermarriage, see Kathleen DuVal, “Indian Intermarriage and Métissage in Colonial Louisiana”. The William and Mary Quarterly 65:2, 2008: 267–304. http://www.jstor.org/stable/25096786.  For one case of a female diplomatic broker in eighteenth century Iroquoia, see Jon Parmenter, "Isabel Montour: Cultural Broker on the Eighteenth-Century Frontiers of New York and Pennsylvania." In Ian K. Steele and Nancy Rhoden, eds.,The Human Tradition in Colonial America, Wilmington, Delaware: Scholarly Resources Press, 1999. 141–59; and Alison Duncan Hirsch, "'The Celebrated Madame Montour': Interpretess across Early American Frontiers", Explorations in Early American Culture 4 (2000): 81–112.<a href="#text" aria-label="Back to content">↵</a></li>
      <li id="them">Erik R. Seeman, "Uncovering Hudson Valley Indian History." Reviews in American History 41:2 (2013): 191-196; Brenda Macdougall. “Speaking of Metis: Reading Family Life into Colonial Records.” Ethnohistory 61:1 (Winter 2014), 31-32; Gunlog Fur, A Nation Of Women: Gender And Colonial Encounters Among The Delaware Indians. University of Pennsylvania Press, 2012; Merritt, 51-59 passim.<a href="#text" aria-label="Back to content">↵</a></li>
      <li id="europe">Sir William Johnson to the Earl of Loudon, “Information of an Onondaga Indian Called by the English Corn-Milk,” Fort Johnson, March 4, 1757, Huntington Library. LO 2971<a href="#text" aria-label="Back to content">↵</a></li>
      <li id="marriages">On Indian conversion in North America, see Jean Fittz Hankins, "Bringing the Good News: Protestant Missionaries to the Indians of New England and New York" (Ph.D. diss., University of Connecticut, 1993); John Frederick Woolverton, Colonial Anglicanism in North America (Detroit: Wayne State University Press, 1984) 103; Allan Greer, "Conversion and Identity," in Conversion: Old Worlds and New Kenneth Mills and Anthony Grafton, eds., (Rochester, N.Y.: University of Rochester Press, 2003); William S. Simmons, "Conversion from Indian to Puritan," New England Quarterly 52 (1979) 197-218. James Axtell, "Were Indian Conversions Bona Fidel" in After Columbus: Essays in the Ethnohistory of Colonial America (New York: Oxford University Press, 1988); Charles L. Cohen, "Conversion among Puritans and Amerindians: A Theological and Cultural Perspective," in Puritanism: Transatlantic Perspectives on a Seventeenth-Century Anglo-American Faith (ed. Francis Bremer; Boston: Massachusetts Historical Society, 1993); Kenneth M. Morrison, The Solidarity of Kin: Ethnohistory, Religious Studies, and the Algonkian-French Religious Encounter (Albany: State University of New York Press, 2002); Linford D. Fisher, “Native Americans, Conversion, and Christian Practice in Colonial New England, 1640—1730,” Harvard Theological Review 102, no. 1 (January 2009): 101–24, https://doi.org/10.1017/S0017816009000054; Neal Salisbury, "Embracing Ambiguity: Native Peoples and Christianity in Seventeenth-Century North America," Ethnohistory 50 (2003) 247-59; Edward E. Andrews, Native Apostles (Harvard University Press, 2013); Linford D. Fisher, The Indian Great Awakening: Religion and the Shaping of Native Cultures in Early America, (New York, NY: Oxford University Press, 2014).<a href="#text" aria-label="Back to content">↵</a></li>
      <li id="sponsors">Henry Barclay, Register of Baptisms, Marriages, Communicants and Funerals at Fort Hunter, 1734.   New-York Historical Society, BV Barclay, http://nyheritage.nnyln.org/digital/collection/p16124coll1/id/45331/; Siversten, 125; Samuel Hopkins, Historical Memoirs Relating to the Housitanic Indians (1911), 27; J. Lydekker, Faithful Mohawks, 53-54.  On early Anglican practices of register keeping, see Shirley Spragge, “‘One Parchment Book at the Charge of the Parish . . . ’: A Sample of Anglican Record Keeping,” Archivaria 30 (Summer 1990): 55–63. <a href="#text" aria-label="Back to content">↵</a></li>
      <li id="lines">On the practice of godparentage and baptismal sponsorship broadly in the early modern period, see Holifield, Theology in America, 53–55; Sidney Mintz and Eric R. Wolf, "An Analysis of Ritual Co-Parenthood (Compadrazgo)," Southwestern Journal of Anthropology 6 (1950): 341-365; Michael Bennett, "Spiritual Kinship and the Baptismal Name in Traditional European Society," L.O. Frappell, ed., Principalities, Powers and Estates: Studies in Medieval and Early Modern Government and Society (Adelaide, 1979): 1-13; and Smith, "Child-Naming Practices as Cultural and Familial Indicators," 13; Stephanie Grauman Wolf, Urban Village: Population, Community and Family Structure in Germantown, Pennsylvania, 1683-1800 (Princeton, 1977): 293-294; Daniel Scott Smith, "Child-Naming Patterns and Family Structure Change: Hingham, Massachusetts 1640-1880," The Newberry Papers in Family and Community History, Paper 76-5; Emily Clark and Virginia Meacham Gould, “The Feminine Face of Afro-Catholicism in New Orleans, 1727-1852,” The William and Mary Quarterly 59, no. 2 (2002): 409–48, https://doi.org/10.2307/3491743; Rebecca Anne Goetz, The Baptism of Early Virginia: How Christianity Created Race (Baltimore: Johns Hopkins University Press, 2012); Edward H. Tebbenhoff, “Tacit Rules and Hidden Family Structures: Naming Practices and Godparentage in Schenectady, New York 1680-1800,” Journal of Social History 18, no. 4 (1985): 567–85; Jewel L. Spangler, Virginians Reborn: Anglican Monopoly, Evangelical Dissent, and the Rise of the Baptists in the Late Eighteenth Century (Charlottesville: University of Virginia Press, 2008); Will Coster, Baptism and Spiritual Kinship in Early Modern England, St. Andrews Studies in Reformation History (Burlington, VT: Ashgate, 2002); Daniel Lindmark, “Baptism and Swedishness in Colonial America: Ethnic and Religious Membership in the Swedish Lutheran Congregations, 1713-1786,” Scriptum 50 (2002): 7–31.<a href="#text" aria-label="Back to content">↵</a></li>
    </ol>
    </footnotes>
  </div></div>
</div>
  <script src="barclay.js"></script>
</body>

</html>
