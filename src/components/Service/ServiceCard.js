import styles from './ServiceCard.module.css'

import {BsFillTrashFill} from 'react-icons/bs'

function ServiceCard({id, name, cost, description, handleRemove}) {

    const Remove = (e) => {
        e.preventDefault()
        handleRemove(id,cost)
    }

 return(
    <div className={styles.project_card}>
        <h4>{name}</h4>
        <p>
            <span>Custo Total:</span> R${cost}
        </p>
        <p>{description}</p>
        <div className={styles.project_card_actions}>
            <button onClick={Remove}>
                <BsFillTrashFill />
                Excluir
            </button>
        </div>
    </div>
 )
}

export default ServiceCard